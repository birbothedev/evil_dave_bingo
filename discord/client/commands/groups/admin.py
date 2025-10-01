from discord.app_commands import Group


class Admin(Group):
    def __init__(self):
        super().__init__(name="admin")