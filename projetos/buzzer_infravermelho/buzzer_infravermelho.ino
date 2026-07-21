void setup() {
  pinMode(10, INPUT);
  Serial.begin(9600);
  pinMode(7, OUTPUT);
}

void loop() {
  Serial.println(digitalRead(10));
  if (digitalRead(10) == 1) {
    digitalWrite(7, HIGH);
  } else {
    digitalWrite(7, LOW);
  }
  delay(10);
}