import gettext
import os
from pathlib import Path

LOCALE_DIR = Path(__file__).parent.parent.parent / "locale"

_translations = {}

def get_translator(lang: str = "en"):
    if lang not in _translations:
        try:
            _translations[lang] = gettext.translation(
                "messages",
                localedir=str(LOCALE_DIR),
                languages=[lang],
                fallback=False,
            )
        except FileNotFoundError:
            if lang != "en":
                return get_translator("en")
            _translations[lang] = gettext.NullTranslations()
    
    return _translations[lang]


def t(msgid: str, lang: str = "en", **kwargs) -> str:
    translator = get_translator(lang)
    translated = translator.gettext(msgid)
    
    if kwargs:
        translated = translated.format(**kwargs)
    
    return translated


def parse_accept_language(header: str) -> str:
    if not header:
        return "en"
    
    primary = header.split(",")[0].strip().split("-")[0].lower()
    
    return primary if primary in {"en", "es"} else "en"
