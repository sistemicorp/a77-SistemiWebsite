---
layout: ../../layouts/Prose.astro
title: "P1150 FAQ: Current Measurement, Calibration & Automation"
heading: P1150 FAQ
description: Answers about the P1150 power profiler, including self calibration, in-rush current, long battery current traces, Python automation and using it with AI agents.
---

## Why is the P1150 Different?

**DOES NOT USE FET Switching architecture**

If you have tried other current measurement devices you may have seen "artifacts" in the measurement. All(\*) other current measurement equipment use multiple shunt resistors and FETs to select which shunt resistor to use based on the magnitude of the current. Switching between FETs is susceptible to charge injection from the Gate-Source capacitance of the FET. That charge injection causes artifacts in the measurement. There is no way to fix that. FET switching architectures must also have an algorithm that must "predict" the current in order to switch the FET(s) into the right range. Some current profiles can cause such algorithms to "thrash" between ranges.

(\*) The exception to this is the Keysight N6700 Series Power Analyzer. The N6700 Series is in a whole other class of device because it provides additional features not related to measuring current, its a large chasis supporting up to 4 channels, and quite expensive.

## Using the P1150 with AI

The [P1150 repo](https://github.com/sistemicorp/P1150) includes an [MCP](https://modelcontextprotocol.io) server (`p1150_mcp`) that lets an AI coding agent, such as Claude Code, Claude Desktop, VS Code or Cursor, drive the P1150 while you develop firmware. The agent can power the target, measure sleep and active current, take a baseline and compare it after you flash a new build, check for in-rush surges, and estimate battery life from the capacity you give it.

You can ask it things like:

- *"Power the target at 3700 mV and measure its sleep current."*
- *"How long will this run on a 220 mAh cell? It needs to last a week."*
- *"Take a baseline, then I'll flash the new build and we'll compare."*

Setup instructions are in the "MCP Server (for AI agents)" section of the repo's README.

## Can you explain more on "Self Calibration"?

- Internal to the P1150 there are 10 resistive loads, 2M, 200K, 20K, 2K, 400, 200, 100, 40, 20, 10 Ohms. During calibration these loads are used to create an expected current. From that expected current, offset and gain correction is computed. The resistors that are used in calibration are 0.1%.
- In addition the Output Voltage is also calibrated with a dedicated high precision 16bit ADC.
- Calibration is done when the device connects to the PC for the first time.
- Calibration can be repeated using Menu->Calibrate.
- From a cold start at room temperature the P1150 raises in ~15DegC temperature. Although I haven't seen much temperature change, you may want to re-calibrate once the P1150 gets up to running temperature. The P1150 temperature is displayed in the GUI.

## Calibration Procedure

The P1150 is self calibrating. However, if you need externally traceable Calibration validation then this procedure can be used by a certified 3rd party.

Procedure [here (PDF)](/docs/P1150-Calibration-Procedure.pdf).

## My DUT is causing a SRC Overcurrent Fault?

The P1150 is a low source resistance power supply. If the DUT pulls high current, the P1150 will attempt to deliver that current. A common DUT design architecture is to have an LDO power a subsection, and enable/disable that LDO for battery current saving. That circuit subsection, powered by the LDO, may have large decoupling caps, that LDO will attempt to power up those caps. At time zero, the current into a cap is "infinite". This is called "in-rush" current.

When a real battery is used, it cannot deliver "infinite" current, because a battery is a chemical process, and has significant source resistance.

The P1150, being a low source resistance power supply will show you the "in-rush" current problem you didn't know you had.

In-rush current(s) are notorious for causing "random" resets in your DUT. Especially when the battery is low in capacity, cold, or "aged", or all of the above. Many microcontrollers have a "brown-out" detector on their VCC supply and will reset. Some microcontrollers, like the STM32 series, have a reset reason register that you can check on boot.

How to fix in-rush currents? Ideally its a hardware change, to use an LDO (or SMPS) with a "soft-start" capability. Often a hardware change is not available. One thing you can try is to "PWM" the enable signal of the LDO (or SMPS). By toggling the enable pin at ever increasing duty cycle, you are "charging" up those decoupling caps slowly. The P1150 has helped many designers tune the toggling of the enable pin.

## How can I make a really long running trace?

There are two approaches, one with the GUI and the other using the Python driver and writing a script.

Regardless of the method you choose, there will be a lot of data exported to a csv file, and plotting that data may prove to be a challenge. There are a number of csv tools that can plot data, one for Windows is called "Flow CSV", which some have had success with.

**The GUI approach, use the mAhr plotting tab**

- Enable both Rolling and Stream checkboxes, set the window to be 1min (the default). The window (time) size only affects the plot shown in the GUI.
- Choose the decimation bandwidth, the default is 1KHz. The higher the bandwidth the more resolution you will get, as well as more data.
- Note that the P1150's sampling rate is not changed when setting this decimation bandwidth, and during decimation the min/max current values are tracked along with the average current. The Max current will track your targets maximum current usage over a decimation window, and not be averaged out.

**The P1150 Python script approach**

- Starts with cloning the [P1150 repo](https://github.com/sistemicorp/P1150).
- After getting the P1150 Python repo installed, extend one of the example scripts to create your exported data.

## Can the P1150 be automated with Python?

Yes. There is a GitHub repo here: [https://github.com/sistemicorp/P1150](https://github.com/sistemicorp/P1150)

Note that the P1150 GUI was created using this same P1150 Python driver.
