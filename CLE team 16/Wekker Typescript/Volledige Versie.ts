let EnableBackupTimer = 0;  //EnableBackupTimer is a number not a boolean because it will easify the process of re enabling it 
let EnableSleepTimer = false;
let EnableAlarm = false;

let UserChosenTime = 0;
let TimerEnd = 0;
let AlarmTimer = 0;
let BackupTimerEnd = 0;
let BackupTimer = 60;

let ChooseColor = 0x7F00FF;
let LightsOn = 0;

let SleepingPadPressed = false;
let AlarmButton = false;
let Notes = "E D# F D# C G F - E D# F D# C G";
music.setVolume(200);


light.setBrightness(10);
let SetThreshold = 1000;

let SetPixelAmount = 0;

let EnableChangeThreshold = false;

//Save State Changes
if (!input.switchRight()) {     //Checks state switch at launch
    EnableChangeThreshold = true;
}

input.onSwitchMoved(SwitchDirection.Left, function () {     //Checks state switch
    if (!EnableSleepTimer || EnableBackupTimer != 0) {
        EnableChangeThreshold = true;
        light.clear();
        if (input.pinA3.isPressed()) {
            light.setAll(255)
        }
    }
})

input.onSwitchMoved(SwitchDirection.Right, function () {    //Checks state switch
    EnableChangeThreshold = false;
    light.clear();
})


input.pinA2.onEvent(ButtonEvent.Down, function () { //Checks state sleeping pad
    SleepingPadPressed = true;
    if (EnableChangeThreshold) {
        light.setAll(Colors.Yellow);
    }
})

input.pinA2.onEvent(ButtonEvent.Up, function () {   //Checks state sleeping pad
    SleepingPadPressed = false;
    if (EnableChangeThreshold) {
        light.setAll(Colors.Orange);
    }
})

input.pinA3.onEvent(ButtonEvent.Click, function () {   //Checks state TurnOffAlarm Button
    TurnAlarmOff();
    AlarmButton = true;
    console.log("TurnAlarmOff is pressed");
})



input.buttonA.onEvent(ButtonEvent.Click, function () {
    if (!EnableSleepTimer || EnableBackupTimer != 0) {
        if (!EnableChangeThreshold) {
            UserChosenTime++;
            AdjustSleepTimer();
        } else {
            SetThreshold += 100;
            AdjustPinThreshold();
        }
    }
})


input.buttonB.onEvent(ButtonEvent.Click, function () {
    if (!EnableSleepTimer || EnableBackupTimer != 0) {
        if (!EnableChangeThreshold) {
            UserChosenTime--;
            AdjustSleepTimer();
        } else {
            SetThreshold -= 100;
            AdjustPinThreshold();
        }
    }
})


//Checks if the UserChosenTime is within the correct range and then calls AdjustPixelAmount
function AdjustSleepTimer() {
    if (UserChosenTime > 10) {
        UserChosenTime = 10;
    }
    else if (UserChosenTime < 1) {
        UserChosenTime = 1;
    }
    SetPixelAmount = -1 + UserChosenTime;

    ChooseColor = 0x0000FF; //Blue
    AdjustPixelAmount();
}
//Checks if the SetThreshold is within the correct range, sets pin threshold and then calls AdjustPixelAmount
function AdjustPinThreshold() {
    if (SetThreshold < 100) {
        SetThreshold = 100;
    } else if (SetThreshold > 1000) {
        SetThreshold = 1000;
    }

    input.pinA2.setThreshold(SetThreshold);
    console.log(`Threshold is currenlty ${SetThreshold}`);

    SetPixelAmount = -1 + SetThreshold / 100;

    ChooseColor = 0x7F00FF; //violet
    AdjustPixelAmount();
}

//Turns off all the lights and then sets the lights to the adjusted value
function AdjustPixelAmount() {
    light.clear();
    for (let OP = 0; OP <= SetPixelAmount; OP++) {
        light.setPixelColor(OP, ChooseColor);
    }
}



//First goes through safety checks to make sure nothing runs double and then sets and enables the alarm timer
input.buttonsAB.onEvent(ButtonEvent.Click, function () {
    if (!EnableSleepTimer || EnableBackupTimer != 0) {
        if (!EnableChangeThreshold) {
            TimerEnd = control.timer1.seconds() + UserChosenTime;
            console.log(`Timer Ends at ${TimerEnd}`);
            EnableSleepTimer = true;
            light.clear();

            UserChosenTime = 0;
            input.pinA2.setThreshold(SetThreshold);
            input.pinA3.setThreshold(500);
        }
    }
})





loops.forever(function () {

    //When enabled checks for if the timer matches the set end time and if so starts the alarm 
    if (EnableSleepTimer && !EnableAlarm) {
        if (control.timer1.seconds() >= TimerEnd && SleepingPadPressed) {
            console.log(`Sleeptimer is turned off`);
            AlarmTimer = control.timer1.seconds() + 60;

            BackupTimerEnd = control.timer1.seconds() + BackupTimer;
            EnableSleepTimer = false;
            EnableBackupTimer = 2;
            AlarmButton = false;
            EnableAlarm = true;
        } else if (control.timer1.seconds() >= TimerEnd && !SleepingPadPressed) {
            TurnAlarmOff();
        }
    }

    if (EnableBackupTimer > 0 && !EnableAlarm) {
        if (EnableBackupTimer > 3) {
            EnableBackupTimer = 0;
        }

        if (control.timer1.seconds() >= BackupTimerEnd) {
            if (SleepingPadPressed) {
                AlarmTimer = control.timer1.seconds() + 10;
                AlarmButton = false;
                EnableAlarm = true;
                console.log("Turning on Alarm");
            } else {
                TurnAlarmOff();
            }
        }
    }





    if (EnableAlarm) {
        console.log("Alarm is being checked");
        if (control.timer1.seconds() >= AlarmTimer) {
            console.log("Extending alarm");
            EnableBackupTimer++;
            BackupTimerEnd = control.timer1.seconds() + BackupTimer;
            EnableAlarm = false;
        } else {
            PlayThatFunkyMusic();
        }
    }
})

function PlayThatFunkyMusic() {
    if (!EnableAlarm || AlarmButton) {
        return;
    }

    crickit.motor1.run(50);
    console.log("play that funky music");
    light.setAll(Colors.Red);
    music.playMelody(Notes, 100);
    PlayThatFunkyMusic();

}

function TurnAlarmOff() {
    if (!EnableAlarm) {
        return;
    }

    crickit.motor1.run(0);
    EnableAlarm = false;
    console.log("turning alarm off");
    music.stopAllSounds();
    EnableBackupTimer--;
    light.clear;
    light.setAll(Colors.Green);
    pause(2000);
    light.clear();
}
