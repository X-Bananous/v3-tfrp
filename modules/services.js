
/* ... (garder le début existant) ... */

export const IllicitViewCheck = () => {
    const u = state.user;
    // On autorise si l'utilisateur a la permission can_manage_illegal OU s'il est dans la guild
    // On simule une vérification de guild plus souple pour éviter les blocages injustifiés
    const hasGuild = u.guilds?.includes(CONFIG.GUILD_ILLEGAL) || state.adminIds.includes(u.id);
    const hasPerm = u.permissions?.can_manage_illegal === true;

    if (!hasGuild && !hasPerm) {
        return false;
    }
    return true;
};

/* ... (suite du fichier services.js) ... */
