let EnableBackupTimer = 0;  //EnableBackupTimer is a number not a boolean because it will easify the process of re enabling it 
let EnableSleepTimer = false;
let EnableAlarm = false;

let UserChosenTime = 0;
let TimerEnd = 0;
let AlarmTimer = 0;
let BackupTimerEnd = 0;
let BackupTimer = 5;

let ChooseColor = "Value";
let LightsOn = 0;

let SleepingPadPressed = false;
let Notes = "CACACA";
music.setVolume(160);


light.setBrightness(10);
let SetThreshold = 200;
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

input.pinA2.onEvent(ButtonEvent.Click, function () {   //Checks state TurnOffAlarm Button
    TurnAlarmOff = true;
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
    
    ChooseColor = "Blue";
    AdjustPixelAmount();
}
    //Checks if the SetThreshold is within the correct range, sets pin threshold and then calls AdjustPixelAmount
function AdjustPinThreshold() {
    if (SetThreshold < 100) {
        SetThreshold = 100;
    } else  if (SetThreshold > 1000) {
        SetThreshold = 1000;
    }

    input.pinA2.setThreshold(SetThreshold);
    console.log(`Threshold is currenlty ${SetThreshold}`);
    
    SetPixelAmount = -1 + SetThreshold / 100;

    ChooseColor = "Violet";
    AdjustPixelAmount();
}

    //Turns off all the lights and then sets the lights to the adjusted value
function AdjustPixelAmount() {  
    light.clear();
    for (let OP = 0; OP <= SetPixelAmount; OP++) {
        light.setPixelColor(OP, Colors.ChooseColor);
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
        }
    }
})





loops.forever(function () {
    
    //When enabled checks for 
if (EnableSleepTimer) {
    // console.log(`SleepTimer ${control.timer1.seconds()}`);
    if (control.timer1.seconds() >= TimerEnd) {
    if (SleepingPadPressed) {
        AlarmTimer = control.timer1.seconds() + 60;
        EnableSleepTimer = false;
        EnableBackupTimer = 2;

        TurnAlarmOff = false;
        EnableAlarm = true;
    } else {
        light.setAll(0x00FF00);
        console.log("Bro already awoke");
        pause(500);
        light.clear();
        EnableSleepTimer = false;
    }
}

if (EnableBackupTimer > 0) {
    if (EnableBackupTimer > 3) {
        EnableBackupTimer = 0;
    }

    if (control.timer1.seconds() >= BackupTimerEnd) {
        if (SleepingPadPressed) {
            AlarmTimer = control.timer1.seconds() + 60;
            EnableBackupTimer = false;
            
            TurnAlarmOff = false;
            EnableAlarm = true;
        } else {
            light.setAll(Colors.Green);
            console.log("You woke up this time");   
            pause(1000);
            light.clear();
            EnableBackupTimer = false;
        }
    }
}





if (EnableAlarm) {
    light.setAll(Colors.Red);

    if (TurnAlarmOff)  {
        EnableSleepTimer = false;
        EnableBackupTimer--;
        light.setAll(Colors.Green);
        pause(500);
        light.clear;
        music.stopAllSounds();
        EnableAlarm = false;
    }   else if (control.timer1.seconds() > AlarmTimer)  {
        EnableBackupTimer++;
        BackupTimerEnd = control.timer1.seconds() + BackupTimer;
        EnableAlarm = false;
    }   else {
        music.playMelody(Notes, 5);
    }
}
}

})


