import { getStatusColor, getPriorityColor, formatLabel } from '../../utils/helpers';

const StatusBadge = ({ value, type = 'status' }) => {
  const colorClass = type === 'priority' ? getPriorityColor(value) : getStatusColor(value);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      {formatLabel(value)}
    </span>
  );
};

export default StatusBadge;