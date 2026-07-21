import os
import json

# Dicionário central contendo os nomes das pastas e a lista de componentes inferidos
# Baseado na arquitetura e eletrônica comum do Arduino
PROJETOS = {
    "buzzer_chuva": ["Arduino Uno", "Buzzer", "Sensor de Chuva", "Resistor", "Jumpers"],
    "buzzer_inclinacao": ["Arduino Uno", "Buzzer", "Sensor de Inclinação (Tilt)", "Resistor", "Jumpers"],
    "buzzer_infravermelho": ["Arduino Uno", "Buzzer", "Sensor Infravermelho", "Resistor", "Jumpers"],
    "buzzer_luminosidade": ["Arduino Uno", "Buzzer", "LDR", "Resistor", "Jumpers"],
    "buzzer_PIR": ["Arduino Uno", "Buzzer", "Sensor PIR", "Jumpers"],
    "buzzer_solo": ["Arduino Uno", "Buzzer", "Sensor de Umidade do Solo", "Resistor", "Jumpers"],
    "buzzer_ultrassonico": ["Arduino Uno", "Buzzer", "Sensor Ultrassônico HC-SR04", "Jumpers"],
    "buzzer_vibracao": ["Arduino Uno", "Buzzer", "Sensor de Vibração", "Resistor", "Jumpers"],
    "led_chuva": ["Arduino Uno", "LED", "Sensor de Chuva", "Resistores", "Jumpers"],
    "led_inclinacao": ["Arduino Uno", "LED", "Sensor de Inclinação (Tilt)", "Resistores", "Jumpers"],
    "led_infravermelho": ["Arduino Uno", "LED", "Sensor Infravermelho", "Resistores", "Jumpers"],
    "led_luminosidade": ["Arduino Uno", "LED", "LDR", "Resistores", "Jumpers"],
    "led_PIR": ["Arduino Uno", "LED", "Sensor PIR", "Resistores", "Jumpers"],
    "led_solo": ["Arduino Uno", "LED", "Sensor de Umidade do Solo", "Resistores", "Jumpers"],
    "led_ultrassonico": ["Arduino Uno", "LED", "Sensor Ultrassônico HC-SR04", "Resistores", "Jumpers"],
    "led_vibracao": ["Arduino Uno", "LED", "Sensor de Vibração", "Resistores", "Jumpers"],
    "piscando_led": ["Arduino Uno", "LED", "Resistor", "Jumpers"],
    "semaforo_simples": ["Arduino Uno", "LED Vermelho", "LED Amarelo", "LED Verde", "Resistores", "Jumpers"],
    "sensor_presenca": ["Arduino Uno", "Sensor PIR", "LED", "Resistor", "Jumpers"],
    "sketch_motor": ["Arduino Uno", "Motor DC", "Transistor", "Diodo", "Resistor", "Fonte Externa", "Jumpers"],
    "tocando_buzzer": ["Arduino Uno", "Buzzer", "Resistor", "Jumpers"]
}

def main():
    """
    Função principal que itera sobre o dicionário de projetos,
    cria os diretórios e escreve os arquivos JSON contendo os componentes.
    """
    pastas_criadas = 0
    arquivos_escritos = 0

    # Diretório de execução atual
    diretorio_base = os.getcwd()

    for nome_pasta, componentes in PROJETOS.items():
        # Caminho completo para a pasta (compatível com Win/Lin/Mac via os.path.join)
        caminho_pasta = os.path.join(diretorio_base, nome_pasta)
        
        # 1. Criação das pastas (apenas se não existirem)
        if not os.path.exists(caminho_pasta):
            os.makedirs(caminho_pasta)
            pastas_criadas += 1
            
        # 2. Criação do arquivo componentes.json
        caminho_arquivo_json = os.path.join(caminho_pasta, "componentes.json")
        
        # Abre o arquivo em modo de escrita, sobrescrevendo se existir. Força UTF-8.
        with open(caminho_arquivo_json, 'w', encoding='utf-8') as arquivo:
            # Serializa a lista do Python para JSON formatado
            json.dump(
                componentes, 
                arquivo, 
                indent=4,              # Indentação de 4 espaços
                ensure_ascii=False     # Preserva acentuação (não converte para unicode escapes)
            )
            arquivos_escritos += 1

    # Resumo final da execução
    print("-" * 40)
    print("Processamento Concluído!")
    print(f"Pastas criadas: {pastas_criadas}")
    print(f"Arquivos JSON gerados/atualizados: {arquivos_escritos}")
    print("-" * 40)

if __name__ == "__main__":
    main()