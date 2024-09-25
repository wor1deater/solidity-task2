import json
import random

# Определяем атрибуты и их вероятности
attributes = {
    "Clothes": {
        "Jacket": 45,
        "Suit": 25,
        "Military": 10,
        "Empty": 20
    },
    "Hair": {
        "Fade": 30,
        "Mohawk": 25,
        "Box": 35,
        "Empty": 10
    },
    "Boots": {
        "Nike": 40,
        "Adidas": 20,
        "New Balance": 10,
        "Empty": 30
    }
}

# Функция для случайного выбора атрибута на основе редкости
def get_random_attribute(attribute_type):
    options = list(attributes[attribute_type].keys())
    weights = list(attributes[attribute_type].values())
    return random.choices(options, weights)[0]

# Базовые данные для NFT
base_metadata = {
    "name": "Gelasimoff NFT",
    "description": "-",
    "attributes": []
}

# Генерация 100 файлов
base_url = "https://ipfs.io/ipfs/Qmb8Guy7sL3i3GWKxaP62m98r8FgMQYoxnpapTmotCDzu1/"

for token_id in range(1, 101):
    metadata = base_metadata.copy()
    metadata["name"] = f"Gelasimoff NFT #{token_id}"
    
    # Формирование динамической ссылки на изображение
    metadata["image"] = f"{base_url}bear-{str(token_id).zfill(4)}.png"  # bear-0001.png, bear-0002.png, ...

    # Генерация атрибутов на основе редкости
    metadata["attributes"] = [
        {"trait_type": "Clothes", "value": get_random_attribute("Clothes")},
        {"trait_type": "Hair", "value": get_random_attribute("Hair")},
        {"trait_type": "Boots", "value": get_random_attribute("Boots")}
    ]

    # Запись JSON-файла
    with open(f'{token_id}.json', 'w') as outfile:
        json.dump(metadata, outfile, indent=4)

print("JSON files with IPFS links generated!")
