import { lazy } from 'react';

// Lazy load dialog components since they're not immediately visible
export const CreateTrackDialog = lazy(() => 
  import('./CreateTrackDialog').then(module => ({ default: module.CreateTrackDialog }))
);
export const EditTrackDialog = lazy(() => 
  import('./EditTrackDialog').then(module => ({ default: module.EditTrackDialog }))
);
export const UpdateAudioDialog = lazy(() => 
  import('./UpdateAudioDialog').then(module => ({ default: module.UpdateAudioDialog }))
);
export const DeleteTrackDialog = lazy(() => 
  import('./DeleteTrackDialog').then(module => ({ default: module.DeleteTrackDialog }))
);
 