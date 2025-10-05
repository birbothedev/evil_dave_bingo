from discord.app_commands import Group


class Template(Group):
    def __init__(self):
        super().__init__(name="template")