import json
import time
import os
from ddgs import DDGS


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_INPUT = os.path.join(BASE_DIR, 'mother.json')
JSON_OUTPUT = os.path.join(BASE_DIR, 'mother_with_images.json')

NAME_FIELD = 'name'
QUERY_SUFFIX = 'reference motherboard'
SKIP_IF_EXISTS = False # ЛУЧШЕ ВКЛЮЧИТЬ, чтобы не запрашивать заново то, что уже нашли
MAX_RESULTS = 1

if not os.path.exists(JSON_INPUT):
    print(f"Ошибка: Файл {JSON_INPUT} не найден!")
    exit()

with open(JSON_INPUT, 'r', encoding='utf-8') as f:
    processors = json.load(f)

print(f"Загружено процессоров: {len(processors)}\n")

updated = []

with DDGS() as ddgs:
    for i, proc in enumerate(processors, 1):
        name = proc.get(NAME_FIELD, "")
        
        # Пропускаем, если ссылка уже есть (экономим запросы)
        if SKIP_IF_EXISTS and proc.get('imageUrl') and proc['imageUrl'].startswith('http'):
            print(f"{i:3d}/{len(processors)} ⏩ {name} (уже есть)")
            updated.append(proc)
            continue

        query = f"{name} {QUERY_SUFFIX}".strip()

        # Цикл для повторной попытки при лимите
        for attempt in range(3):
            try:
                results = ddgs.images(query, max_results=MAX_RESULTS)
                
                if results:
                    best_image = results[0]['image']
                    proc['imageUrl'] = best_image
                    print(f"{i:3d}/{len(processors)} ✅ {name}")
                else:
                    print(f"{i:3d}/{len(processors)} ❌ {name} — не найдено")
                
                break # Успех, выходим из цикла попыток

            except Exception as e:
                error_msg = str(e).lower()
                if "403" in error_msg or "ratelimit" in error_msg:
                    wait_time = 20 + (attempt * 10)
                    print(f"⚠️ Лимит запросов! Ждем {wait_time} сек... (Попытка {attempt+1})")
                    time.sleep(wait_time)
                else:
                    print(f"⚠️ Ошибка для {name}: {e}")
                    break

        updated.append(proc)

        
        if i % 5 == 0:
            with open(JSON_OUTPUT, 'w', encoding='utf-8') as f:
                json.dump(updated, f, ensure_ascii=False, indent=2)

with open(JSON_OUTPUT, 'w', encoding='utf-8') as f:
    json.dump(updated, f, ensure_ascii=False, indent=2)

print(f"\n✅ Готово! Результат: {JSON_OUTPUT}")