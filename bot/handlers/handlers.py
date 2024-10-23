import asyncio
import logging

from aiogram.fsm.storage.memory import MemoryStorage
from aiogram import Bot, Dispatcher, Router
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.types import Message
from aiogram.types import WebAppInfo
from aiogram.filters import Command
from aiogram.utils.keyboard import InlineKeyboardBuilder

WEB_APP_URL = "https://127.0.0.1"

router = Router()


@router.message(Command("play"))
async def send_welcome(message: Message):
    builder = InlineKeyboardBuilder()
    builder.button(text="Начать игру", web_app=WebAppInfo(url=WEB_APP_URL))

    await message.answer(
        "Привет! Это бот для запуска игры 'Змейка'. Нажмите на кнопку ниже, чтобы начать игру.",
        reply_markup=builder.as_markup(),
        resize_keyboard=True,
        one_time_keyboard=True,
    )
