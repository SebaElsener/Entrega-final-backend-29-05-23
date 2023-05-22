
userPassCheck.addEventListener('change', () => {
    const userPass = document.getElementById('userPass')
    const userPassCheck = document.getElementById('userPassCheck')
    const errorPassCheck = document.getElementById('errorPassCheck')
    if (userPass.value !== userPassCheck.value) {
        errorPassCheck.style.display = 'block'
    } else {
        errorPassCheck.style.display = 'none'
    }
})