long readUltrasonicDistance(int triggerPin, int echoPin) {
  pinMode(triggerPin, OUTPUT);
  digitalWrite(triggerPin, LOW);
  delayMicroseconds(2);
  digitalWrite(triggerPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(triggerPin, LOW);
  pinMode(echoPin, INPUT);
  return pulseIn(echoPin, HIGH);
}

void setup() {
  Serial.begin(9600);
  pinMode(7, OUTPUT);
}

void loop() {
  Serial.println(0.01723 * readUltrasonicDistance(3, 2));
  if (0.01723 * readUltrasonicDistance(3, 2) > 200) {
    digitalWrite(7, HIGH);
  } else {
    digitalWrite(7, LOW);
  }
  delay(10);
}