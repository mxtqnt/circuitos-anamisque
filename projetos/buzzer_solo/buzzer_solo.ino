void setup() {
  pinMode(A0, INPUT);
  Serial.begin(9600);
  pinMode(7, OUTPUT);
}

void loop() {
  Serial.println(analogRead(A0));
  if (analogRead(A0) > 500) {
    digitalWrite(7, HIGH);
  } else {
    digitalWrite(7, LOW);
  }
  delay(10);
}