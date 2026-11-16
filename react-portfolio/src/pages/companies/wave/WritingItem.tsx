import { Navigate } from 'react-router-dom';
import { useCompany } from '../../../context/CompanyContext';

// This site has no writing section.
export default function WritingItem() {
  const { base } = useCompany();
  return <Navigate to={base} replace />;
}
