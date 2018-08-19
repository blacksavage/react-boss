export function getRedirectPath ({ type, avatar }) {
    let url = type === 'boss' ? '/boss' : '/genius'
    if (!avatar) {
        url += 'Info'
    }
    return url
}

export function getChatId (userId, targetId) {
    return [userId, targetId].sort().join('_')
}