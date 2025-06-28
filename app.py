from flask import Flask, render_template, request, jsonify, url_for
import random
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Фиксированные выигрышные линии (задайте здесь свои линии!)
WINNING_LINES = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [0, 1, 2, 3],
    [5, 6, 7, 8],
    [10, 11, 12, 13],
    [0, 1, 2],
    [5, 6, 7],
    [10, 11, 12],
    [0, 6, 12, 8, 4],
    [0, 6, 12, 8],
    [0, 6, 12],
    [10, 6, 2, 8, 14],
    [10, 6, 2, 8],
    [10, 6, 2],
    [5, 1, 2, 3, 9],
    [5, 1, 2, 3],
    [5, 1, 2],
    [5, 11, 12, 13, 9],
    [5, 11, 12, 13],
    [5, 11, 12],
    [0, 1, 7, 13, 14],
    [0, 1, 7, 13],
    [0, 1, 7],
    [10, 11, 7, 3, 4],
    [10, 11, 7, 3],
    [10, 11, 7],
    [5, 11, 7, 3, 9],
    [5, 11, 7, 3],
    [5, 11, 7],
    [5, 1, 7, 13, 9],
    [5, 1, 7, 13],
    [5, 1, 7],
    [0, 6, 7, 8, 4],
    [0, 6, 7, 8],
    [0, 6, 7],
    [10, 6, 7, 8, 14],
    [10, 6, 7, 8],
    [10, 6, 7],
    [0, 6, 2, 8, 4],
    [0, 6, 2, 8],
    [0, 6, 2],
    [10, 6, 12, 8, 14],
    [10, 6, 12, 8],
    [10, 6, 12],
    [5, 6, 2, 8, 9],
    [5, 6, 2, 8],
    [5, 6, 2],
    [5, 6, 12, 8, 9],
    [5, 6, 12, 8],
    [5, 6, 12],
    [0, 1, 12, 3, 4],
    [0, 1, 12, 3],
    [0, 1, 12],
    [10, 11, 2, 13, 14],
    [10, 11, 2, 13],
    [10, 11, 2],
    [0, 11, 12, 13, 4],
    [0, 11, 12, 13],
    [0, 11, 12],
    [10, 1, 2, 3, 14],
    [10, 1, 2, 3],
    [10, 1, 2]
]

# Информация о символах
SYMBOLS = {
    "dog1": {"name_ru": "Большой Пес", "multiplier": {5: 50, 4: 25, 3: 6}, "image": "dog1.png"},
    "dog2": {"name_ru": "Йоркширский Терьер", "multiplier": {5: 40, 4: 20, 3: 5}, "image": "dog2.png"},
    "dog3": {"name_ru": "Мопс", "multiplier": {5: 30, 4: 15, 3: 4}, "image": "dog3.png"},
    "dog4": {"name_ru": "Такса", "multiplier": {5: 20, 4: 13, 3: 3}, "image": "dog4.png"},
    "collar": {"name_ru": "Ошейник", "multiplier": {5: 15, 4: 10, 3: 2}, "image": "collar.png"},
    "bone": {"name_ru": "Кость", "multiplier": {5: 10, 4: 8, 3: 2}, "image": "bone.png"},
    "A": {"name_ru": "A", "multiplier": {5: 8, 4: 4, 3: 1}, "image": "A.png"},
    "K": {"name_ru": "K", "multiplier": {5: 7, 4: 3.5, 3: 0.8}, "image": "K.png"},
    "Q": {"name_ru": "Q", "multiplier": {5: 6.5, 4: 3, 3: 0.5}, "image": "Q.png"},
    "J": {"name_ru": "J", "multiplier": {5: 6, 4: 2.5, 3: 0.5}, "image": "J.png"},
    "10": {"name_ru": "10", "multiplier": {5: 5, 4: 2, 3: 0.5}, "image": "10.png"},
    "bonus": {"name_ru": "Бонус", "multiplier": {}, "image": "bonus.jpg"},
    "wild": {"name_ru": "Wild", "multiplier": {}, "image": "wild.png"}
}

SYMBOL_NAMES = list(SYMBOLS.keys()) #Список названий символов для генерации доски

ROWS = 3
COLS = 5

def generate_slot_board(rows, cols, symbols_list):
    board = []
    for _ in range(rows):
        row = random.choices(symbols_list, k=cols)
        board.append(row)
    return board

def calculate_winnings(board, winning_lines, symbols_info, rows, cols, bet_amount):
    total_winnings = 0
    print(f"Ставка: {bet_amount}")
    print(f"Проверяемые линии: {winning_lines}")

    # Сортируем линии по убыванию длины
    winning_lines.sort(key=len, reverse=True)

    covered_positions = set()

    for line in winning_lines:
        print(f"Текущая линия: {line}")
        
        # Проверяем, что все позиции в линии еще не покрыты
        valid_line = True
        for pos in line:
            if pos in covered_positions:
                valid_line = False
                break

        if not valid_line:
            print("Линия пропущена, так как позиции уже покрыты")
            continue # К следующей линии

        symbols_on_line = []
        for i in range(len(line)):
            if line[i] < rows * cols:
                symbol = board[line[i] // cols][line[i] % cols]
                symbols_on_line.append(symbol)
                print(f"Символ на позиции {line[i]}: {symbol}")
            else:
                symbols_on_line.append(None)

        while symbols_on_line and symbols_on_line[-1] is None:
            symbols_on_line.pop()
        print(f"Символы на линии: {symbols_on_line}")

        # Проверяем выигрыш только если линия валидна
        if len(symbols_on_line) > 2:
            first_symbol = symbols_on_line[0]
            if all(symbol == first_symbol for symbol in symbols_on_line):
                line_length = len(symbols_on_line)
                if line_length in symbols_info[first_symbol]["multiplier"]:
                    multiplier = symbols_info[first_symbol]["multiplier"][line_length]
                    payout = bet_amount * multiplier
                    print(f"Выигрыш! Длина линии: {line_length}, Символ: {first_symbol}, Множитель: {multiplier}, Выплата: {payout}")
                    total_winnings += payout

                    # Добавляем позиции линии в covered_positions только если линия выиграла
                    for pos in line:
                        covered_positions.add(pos)
                else:
                    print("Нет множителя для этой длины линии")
            else:
                print("Не выигрышная линия")

    print(f"Итоговый выигрыш: {total_winnings}")
    return total_winnings

balance = 100000 

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/spin", methods=["POST"])
def spin():
    global balance
    data = request.get_json()
    bet_amount = data.get('bet', 10) # Получаем ставку из запроса, по умолчанию 10
    # Проверяем, достаточно ли средств на балансе
    if balance < bet_amount:
        return jsonify({"error": "Бабок не хватает", "balance": balance}) # Отправляем ошибку
    # Уменьшаем баланс на ставку
    balance -= bet_amount
    
    # Генерируем игровое поле
    board = generate_slot_board(ROWS, COLS, SYMBOL_NAMES)

    print("Проверка внутри spin:")
    print(f"ROWS: {ROWS}, COLS: {COLS}")
    print(f"Board: {board}")
    print(f"Winning lines: {WINNING_LINES}")
    print(f"SYMBOLS: {SYMBOLS}") # добавленная строка

    # Рассчитываем выигрыш (используем WINNING_LINES и SYMBOLS)
    total_winnings = calculate_winnings(board, WINNING_LINES, SYMBOLS, ROWS, COLS, bet_amount) # Передаем bet_amount

    # Обновляем баланс
    balance += total_winnings

    # Собираем данные для ответа
    board_with_images = []
    for row in board:
        image_row = [url_for('static', filename=f"img/{SYMBOLS[cell]['image']}") for cell in row] #Получаем имя картинки из словаря
        board_with_images.append(image_row)

    result = {
        "balance": round(balance, 1),
        "board": board_with_images,
        "total_winnings": round(total_winnings, 1),
        "bonus_message": ""  # Уберите или измените это
    }

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
