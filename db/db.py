import pymysql
from config import HOST, PORT, USER, PASSWORD, DATABASE, TABLE


def connect_to_db():
    conn = pymysql.connect(host=HOST, port=PORT, user=USER, password=PASSWORD,
                           db=DATABASE)
    return conn


def check_user_in_db(user_id):
    conn = connect_to_db()
    with conn.cursor() as cur:
        data = cur.execute(
            f"SELECT * FROM {TABLE} WHERE tg_user_id = {user_id};")
        conn.close()
        if data == 0:
            return False
        else:
            return True


def save_progress_to_db(user_id, snake_position, food_position, direction, score):
    check = check_user_in_db(user_id)
    conn = connect_to_db()
    with conn.cursor() as cur:
        if check is False:
            cur.execute(
                f"INSERT {TABLE} (tg_user_id, snake_position, food_position, direction, score) "
                f"VALUES ({user_id}, '{snake_position}', '{food_position}', '{direction}', {score});"
            )
        else:
            cur.execute(
                f"UPDATE {TABLE} SET snake_position = '{snake_position}', food_position = '{food_position}', "
                f"direction = '{direction}', score = {score} WHERE tg_user_id = {user_id};"
            )
    conn.commit()
    conn.close()


def load_progress_from_db(user_id):
    check = check_user_in_db(user_id)
    conn = connect_to_db()
    with conn.cursor() as cur:
        if check is False:
            conn.close()
            return {}
        else:
            cur.execute(
                f"SELECT * FROM {TABLE} WHERE tg_user_id = {user_id}"
            )
            data = cur.fetchall()
            data = data[0]
            conn.close()
            return {
                "snake_position": data[2],
                "food_position": data[3],
                "direction": data[4],
                "score": data[5]
            }
