import asyncio
import logging

from aiogram.fsm.storage.memory import MemoryStorage
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from handlers.handlers import router

BOT_TOKEN = "7035341999:AAFDxdtAegbrYuufpu2uSGvWWjPZ_G4YH68"

bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher(storage=MemoryStorage())
dp.include_router(router)

WEB_APP_URL = "https://127.0.0.1"
logger = logging.getLogger(__name__)


async def main():
    logging.basicConfig(level=logging.INFO)
    await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())


if __name__ == '__main__':
    asyncio.run(main())
