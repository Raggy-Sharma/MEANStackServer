module.exports.generate_random_string = (string_length) => {
    let random_string = '';
    let random_ascii;
    for(let i = 0; i < string_length; i++) {
        random_ascii = Math.floor((Math.random() * 25) + 97);
        random_string += String.fromCharCode(random_ascii)
    }
    console.log('random_string: ', random_string)
    return random_string
}