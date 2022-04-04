export function confirmValidator(password, confirm) {
    if (!confirm) return "Password tidak boleh kosong."
    if (confirm != password) return 'Password tidak sama'
    return ''
}