export interface LiveboxInfo {
  osdContext: string;
  playedMediaType: string;
  playedMediaState: string;
  playedMediaId: string;
  playedMediaContextId: string;
  playedMediaPosition: string;
  timeShiftingState: string;
  macAddress: string;
  wolSupport: string;
  friendlyName: string;
  activeStandbyState: string;
}

/**
 * @see https://github.com/DalFanajin/Orange-Livebox-TV-UHD-4K-python-controller
 */
export enum LiveboxKey {
  Power = 116,
  Up = 103,
  Down = 108,
  Left = 75,
  Right = 77,
  Ok = 28,
  Back = 158,
  PlayPause = 207,
  VolPlus = 115,
  VolMin = 114,
  FastForward = 159,
  Rewind = 168,
}