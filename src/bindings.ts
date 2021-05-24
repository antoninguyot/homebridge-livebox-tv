/**
 * @see https://github.com/DalFanajin/Orange-Livebox-TV-UHD-4K-python-controller/blob/master/keys.md
 */
export const LiveboxKeys = {
  POWER: 116,
  UP: 103,
  DOWN: 108,
  LEFT: 75,
  RIGHT: 77,
  OK: 28,
  BACK: 158,
  PLAY_PAUSE: 207,
  VOLPLUS: 115,
  VOLMIN: 114,
  FAST_FORWARD: 159,
  REWIND: 168,
};

/**
 * @see https://github.com/DalFanajin/Orange-Livebox-TV-UHD-4K-python-controller
 */
export const LiveboxOperations = {
  KEY: 1,
  CHANNEL: 9,
  INFO: 10,
};

/**
 * @see https://github.com/DalFanajin/Orange-Livebox-TV-UHD-4K-python-controller
 */
export const LiveboxModes = {
  KEYPRESS: 0,
  KEYDOWN: 1,
  KEYUP: 2,
};

/**
 * @see RemoteKey
 */
const RemoteKeys = {
  REWIND: 0,
  FAST_FORWARD: 1,
  NEXT_TRACK: 2,
  PREVIOUS_TRACK: 3,
  ARROW_UP: 4,
  ARROW_DOWN: 5,
  ARROW_LEFT: 6,
  ARROW_RIGHT: 7,
  SELECT: 8,
  BACK: 9,
  EXIT: 10,
  PLAY_PAUSE: 11,
  INFORMATION: 15,
};

export const Bindings = {
  [RemoteKeys.ARROW_UP]: LiveboxKeys.UP,
  [RemoteKeys.ARROW_DOWN]: LiveboxKeys.DOWN,
  [RemoteKeys.ARROW_LEFT]: LiveboxKeys.LEFT,
  [RemoteKeys.ARROW_RIGHT]: LiveboxKeys.RIGHT,
  [RemoteKeys.SELECT]: LiveboxKeys.OK,
  [RemoteKeys.BACK]: LiveboxKeys.BACK,
  [RemoteKeys.PLAY_PAUSE]: LiveboxKeys.PLAY_PAUSE,
  [RemoteKeys.FAST_FORWARD]: LiveboxKeys.FAST_FORWARD,
  [RemoteKeys.REWIND]: LiveboxKeys.REWIND,
};