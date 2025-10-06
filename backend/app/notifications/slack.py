import logging

import httpx

from ..config import get_settings

logger = logging.getLogger(__name__)


class SlackNotifier:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def send(self, text: str) -> None:
        if not self.settings.slack_webhook:
            logger.info('Slack notification skipped: %s', text)
            return
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(self.settings.slack_webhook, json={'text': text})
            response.raise_for_status()
