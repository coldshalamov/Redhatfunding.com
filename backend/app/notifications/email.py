from __future__ import annotations

import logging
from email.message import EmailMessage

import aiosmtplib

from ..config import get_settings

logger = logging.getLogger(__name__)


class EmailNotifier:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def send_lead_notification(self, lead_summary: str) -> None:
        message = EmailMessage()
        message['Subject'] = 'New RedHat Funding lead'
        message['From'] = self.settings.sales_inbox
        message['To'] = self.settings.sales_inbox
        message.set_content(lead_summary)

        if not self.settings.smtp_host or not self.settings.smtp_username or not self.settings.smtp_password:
            logger.info('Email notification (console fallback): %s', lead_summary)
            return

        await aiosmtplib.send(
            message,
            hostname=self.settings.smtp_host,
            port=self.settings.smtp_port,
            username=self.settings.smtp_username,
            password=self.settings.smtp_password,
            start_tls=True,
        )

    async def send_autoresponder(self, to_email: str, body: str) -> None:
        message = EmailMessage()
        message['Subject'] = 'Thanks for applying to RedHat Funding'
        message['From'] = self.settings.sales_inbox
        message['To'] = to_email
        message.set_content(body)

        if not self.settings.smtp_host or not self.settings.smtp_username or not self.settings.smtp_password:
            logger.info('Autoresponder (console fallback) to %s: %s', to_email, body)
            return

        await aiosmtplib.send(
            message,
            hostname=self.settings.smtp_host,
            port=self.settings.smtp_port,
            username=self.settings.smtp_username,
            password=self.settings.smtp_password,
            start_tls=True,
        )


async def notify_sales(lead_summary: str) -> None:
    notifier = EmailNotifier()
    await notifier.send_lead_notification(lead_summary)


async def send_autoresponse(to_email: str, body: str) -> None:
    notifier = EmailNotifier()
    await notifier.send_autoresponder(to_email, body)
