# Homebridge Livebox TV

Control your Livebox TV from Homekit, turning it into a smart TV.

## Features

This plugin currently support the following features :

- On/Off via the Home App or Siri
- Remote control via the Remote App or the control center (up/down/right/left arrows, menu, back button)
- Volume control via the Remote App

If your TV supports HDMI-CEC, don't forget to turn it on in the Livebox settings so that turning on your Livebox will
also turn on your TV.

## Configuration

Add the following accessory to your accessories array :
```json
{
  "accessories": [
    {
      "name": "Livebox 4",
      "ip": "192.168.1.12",
      "accessory": "LiveboxTV"
    }
  ]
}
```

Or use the Homebridge Config UI.

## Known issues

- The TV status isn't yet updated from the Livebox, it is random so you might experience issues when toggling your TV
  on/off.
- I only have a Livebox 4 to test on, so it won't work on any other model. If you try though, DM me to let me know if
  anything changed in the new Livebox firmwares.

