import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import SearchableDropdown from '../components/SearchableDropdown';
import MultiRoleSelect from '../components/MultiRoleSelect';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getProjects } from '../api/projectApi';
import { getRolesByProject } from '../api/roleApi';
import { createRequest } from '../api/requestApi';
import { getErrorMessage } from '../utils/apiError';
import { fromDatetimeLocalValue } from '../utils/formatDate';

export default function NewRequestPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subjectEmail: '',
      projectId: '',
      roleIds: [],
      justification: '',
      startDateTime: '',
      endDateTime: '',
    },
  });

  const projectId = watch('projectId');
  const roleIds = watch('roleIds');
  const startDateTime = watch('startDateTime');
  const endDateTime = watch('endDateTime');

  useEffect(() => {
    getProjects()
      .then((res) => setProjects(res.data))
      .catch(() => addToast('Failed to load projects', 'error'))
      .finally(() => setLoadingProjects(false));
  }, [addToast]);

  useEffect(() => {
    if (!projectId) {
      setRoles([]);
      setValue('roleIds', []);
      return;
    }
    setLoadingRoles(true);
    setValue('roleIds', []);
    getRolesByProject(projectId)
      .then((res) => setRoles(res.data))
      .catch(() => addToast('Failed to load roles for project', 'error'))
      .finally(() => setLoadingRoles(false));
  }, [projectId, setValue, addToast]);

  const buildPayload = (data) => {
    const project = projects.find((p) => p.id === data.projectId);
    const roleNames = roles
      .filter((r) => data.roleIds.includes(r.id))
      .map((r) => r.name);
    return {
      requester: user.email,
      subjectEmail: data.subjectEmail.trim(),
      projectId: data.projectId,
      projectName: project?.name,
      roles: roleNames,
      roleIds: data.roleIds,
      justification: data.justification.trim(),
      startDate: fromDatetimeLocalValue(data.startDateTime),
      endDate: fromDatetimeLocalValue(data.endDateTime),
    };
  };

  const onFormSubmit = (data) => {
    setDuplicateWarning(null);
    setPendingPayload(buildPayload(data));
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    if (!pendingPayload) return;
    setSubmitting(true);
    setDuplicateWarning(null);
    try {
      await createRequest(pendingPayload);
      addToast('Access request submitted successfully');
      reset();
      setShowConfirm(false);
      setPendingPayload(null);
    } catch (err) {
      if (err.status === 409 && err.data?.duplicateRoles) {
        setDuplicateWarning(err.data.duplicateRoles);
        setShowConfirm(false);
      } else {
        addToast(getErrorMessage(err, 'Failed to submit request'), 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const validateEndAfterStart = (end) => {
    if (!end || !startDateTime) return true;
    return new Date(end) > new Date(startDateTime) || 'End must be after start date & time';
  };

  const selectedRoleNames = roles
    .filter((r) => roleIds.includes(r.id))
    .map((r) => r.name);

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary">New Request</h2>
      <p className="mt-1 text-sm text-text-muted">
        Request IAM role access for a user in a GCP project
      </p>

      {duplicateWarning && (
        <div
          className="mt-6 flex items-start gap-3 rounded border border-amber-200 bg-amber-50 px-4 py-3"
          role="alert"
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-amber-900">Duplicate request warning</p>
            <p className="mt-1 text-sm text-amber-800">
              A pending request already exists with overlapping roles:{' '}
              {duplicateWarning.join(', ')}. Review existing requests before submitting again.
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto mt-8 max-w-2xl">
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="rounded border border-border bg-white p-6 shadow-sm md:p-8"
          noValidate
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="subjectEmail" className="mb-1.5 block text-sm font-medium text-text">
                Subject Email <span className="text-red-500">*</span>
              </label>
              <input
                id="subjectEmail"
                type="email"
                {...register('subjectEmail', {
                  required: 'Subject email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
                className={`w-full rounded border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 ${
                  errors.subjectEmail
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-border focus:border-primary focus:ring-primary'
                }`}
                placeholder="user@company.com"
              />
              {errors.subjectEmail && (
                <p className="mt-1 text-xs text-red-600">{errors.subjectEmail.message}</p>
              )}
            </div>

            <Controller
              name="projectId"
              control={control}
              rules={{ required: 'GCP project is required' }}
              render={({ field }) => (
                <SearchableDropdown
                  label="GCP Project"
                  options={projects}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={loadingProjects ? 'Loading projects...' : 'Select a project'}
                  disabled={loadingProjects}
                  error={errors.projectId?.message}
                />
              )}
            />

            <Controller
              name="roleIds"
              control={control}
              rules={{
                validate: (v) =>
                  (v && v.length > 0) || 'Select at least one role',
              }}
              render={({ field }) => (
                <MultiRoleSelect
                  label="Roles"
                  options={roles}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={!projectId || loadingRoles}
                  placeholder={
                    !projectId
                      ? 'Select a project first'
                      : loadingRoles
                        ? 'Loading roles...'
                        : 'Search and select roles...'
                  }
                  error={errors.roleIds?.message}
                />
              )}
            />

            <div>
              <label htmlFor="justification" className="mb-1.5 block text-sm font-medium text-text">
                Justification <span className="text-red-500">*</span>
              </label>
              <textarea
                id="justification"
                rows={4}
                {...register('justification', {
                  required: 'Justification is required',
                  minLength: { value: 10, message: 'Provide at least 10 characters' },
                })}
                className={`w-full resize-y rounded border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 ${
                  errors.justification
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-border focus:border-primary focus:ring-primary'
                }`}
                placeholder="Describe the business need for this access..."
              />
              {errors.justification && (
                <p className="mt-1 text-xs text-red-600">{errors.justification.message}</p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="startDateTime" className="mb-1.5 block text-sm font-medium text-text">
                  Start Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  id="startDateTime"
                  type="datetime-local"
                  {...register('startDateTime', { required: 'Start date & time is required' })}
                  className={`w-full rounded border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 ${
                    errors.startDateTime
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                />
                {errors.startDateTime && (
                  <p className="mt-1 text-xs text-red-600">{errors.startDateTime.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="endDateTime" className="mb-1.5 block text-sm font-medium text-text">
                  End Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  id="endDateTime"
                  type="datetime-local"
                  {...register('endDateTime', {
                    required: 'End date & time is required',
                    validate: validateEndAfterStart,
                  })}
                  min={startDateTime || undefined}
                  className={`w-full rounded border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 ${
                    errors.endDateTime
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                />
                {errors.endDateTime && (
                  <p className="mt-1 text-xs text-red-600">{errors.endDateTime.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              Submit Request
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

      <ConfirmModal
        open={showConfirm}
        title="Confirm Access Request"
        message={
          pendingPayload
            ? `Submit access request for ${pendingPayload.subjectEmail} on ${pendingPayload.projectName || pendingPayload.projectId} with roles: ${selectedRoleNames.join(', ') || 'none'}?`
            : ''
        }
        confirmLabel="Submit"
        onConfirm={handleConfirmSubmit}
        onCancel={() => {
          setShowConfirm(false);
          setPendingPayload(null);
        }}
        loading={submitting}
      />
    </div>
  );
}
