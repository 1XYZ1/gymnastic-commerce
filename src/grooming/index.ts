// Hooks
export {
  useGroomingRecords,
  useGroomingRecord,
  useGroomingMutations,
} from './hooks';

// Services
export {
  GroomingValidationService,
  GroomingStatsService,
} from './services';

// Repository
export { getGroomingRepository } from './repositories';

// Components
export {
  GroomingRecordCard,
  GroomingStatsCard,
  PopularServicesChart,
  GroomingRecordForm,
  GroomingRecordDetail,
} from './components';

// Pages
export {
  GroomingHistoryPage,
  GroomingRecordPage,
  NewGroomingRecordPage,
} from './pages';

// Config
export * from './config';

// Types
export type {
  GroomingRecord,
  CreateGroomingRecordDto,
} from './types';
