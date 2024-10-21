
let EnableBackupTimerEnd = false;
let EnableSleepTimer = false;

let UserChosenTime = 0;
let TimerEnd = 0;
let AlarmTimer = 3600;
let BackupTimerEnd = 0;
let BackupTimer = 5;

let LightsOn = 0;

let pinPressed = false;
let notes = "CACACACACACACA";
music.setVolume(160);
light.setBrightness(10);

let SetThreshold = 200;
let SetPixelAmount = 0;
light.setBrightness(5);

let EnableChangeThreshold = false;

if (!input.switchRight()) {
    EnableChangeThreshold = true;
}



input.onSwitchMoved(SwitchDirection.Left, function () {
    if (!EnableSleepTimer || !EnableBackupTimerEnd) {
        EnableChangeThreshold = true;
        light.clear();
    }
})

input.onSwitchMoved(SwitchDirection.Right, function () {
    EnableChangeThreshold = false;
    light.clear();
})



input.buttonA.onEvent(ButtonEvent.Click, function () {
    if (!EnableBackupTimerEnd || !EnableBackupTimerEnd) {
        if (!EnableChangeThreshold) {
            UserChosenTime++;
            if (UserChosenTime > 10) {
                UserChosenTime = 10;
            }
            LightsOn = -1 + UserChosenTime;
            light.setPixelColor(LightsOn, 0x0000FF);
            console.log(`User chosen time is ${UserChosenTime}`);
        } else {
            SetThreshold += 100;
            if (SetThreshold > 1000) {
                SetThreshold = 1000;
            }
            input.pinA2.setThreshold(SetThreshold);
            console.log(`Threshold is currenlty ${SetThreshold}`);
            ThresholdPixelAmount();
        }
    }
})


input.buttonB.onEvent(ButtonEvent.Click, function () {
    if (!EnableBackupTimerEnd || !EnableBackupTimerEnd) {
        if (!EnableChangeThreshold) {
            UserChosenTime--;
            if (UserChosenTime < 0) {
                UserChosenTime = 0;
            }
            LightsOn = UserChosenTime;
            light.setPixelColor(LightsOn, Colors.Black);
            console.log(`User chosen time is ${UserChosenTime}`);

        } else {
            SetThreshold -= 100;
            if (SetThreshold < 100) {
                SetThreshold = 100;
            }
            input.pinA2.setThreshold(SetThreshold);
            console.log(`Threshold is currenlty ${SetThreshold}`);

            ThresholdPixelAmount();
        }
    }
})


input.buttonsAB.onEvent(ButtonEvent.Click, function () {
    if (!EnableBackupTimerEnd || !EnableBackupTimerEnd) {
        if (!EnableChangeThreshold) {
            TimerEnd = control.timer1.seconds() + UserChosenTime;
            console.log(`Timer Ends at ${TimerEnd}`);
            EnableSleepTimer = true;
            light.clear();
            UserChosenTime = 0;
        }
    }
})


input.pinA2.onEvent(ButtonEvent.Down, function () {
    pinPressed = true;
    if (EnableChangeThreshold) {
        light.setAll(Colors.Yellow);
    }
})

input.pinA2.onEvent(ButtonEvent.Up, function () {
    pinPressed = false;

    if (EnableChangeThreshold) {
        light.setAll(Colors.Pink);
    }
})


function ThresholdPixelAmount() {
    SetPixelAmount = -1 + SetThreshold / 100;

    light.clear();
    for (let OP = 0; OP <= SetPixelAmount; OP++) {
        light.setPixelColor(OP, Colors.Violet);
    }
}


loops.forever(function () {
    if (EnableSleepTimer) {
        console.log(`SleepTimer ${control.timer1.seconds()}`);
        if (control.timer1.seconds() >= TimerEnd) {
            if (pinPressed) {
                light.setAll(0xFF0000);
                console.log("Wake up");
                pause(500);
                music.playMelody(notes, 30);
                light.clear();
            } else {
                light.setAll(0x00FF00);
                console.log("Bro already awoke");
                pause(500);
                light.clear();
            }

            EnableSleepTimer = false;
            BackupTimerEnd = control.timer1.seconds() + BackupTimer;

            EnableBackupTimerEnd = true;
        }
    }

    if (EnableBackupTimerEnd) {
        console.log(`BackupTimerEnd ${control.timer1.seconds()}`)
        if (control.timer1.seconds() >= BackupTimerEnd) {
            if (pinPressed) {
                light.setAll(Colors.Red);
                console.log("You really gotta wake up now");
                pause(500);
                music.playMelody(notes, 30);

            } else {
                light.setAll(Colors.Green);
                console.log("You woke up this time");
            }

            pause(1000);
            light.clear();
            EnableBackupTimerEnd = false;
        }
    }



})
