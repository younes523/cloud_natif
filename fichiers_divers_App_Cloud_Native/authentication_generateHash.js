/* const bcrypt = require('bcrypt');
const fixedsalt= '$2b$10$J9p8h1TEhTN6hjkf0p6f2O';
// Generate a salt and hash the plain password

/*
en fournissant un 'fixedsalt' en deuxième argument, la fonction hash() renvoie le même retour pour une 
chaine donnée car sinon, elle générera à chaque fois un 'salt' différent, ce qui entrainera une valeur 
de retour différente à chaque fois pour la même chaine d'entrée
*/ 
/*
bcrypt.hash("plainPassword", fixedsalt) 
  .then(hashedPassword => { // hashedPassword : représente le haché de la chaine : "plainPassword"
    console.log('Hashed password:', hashedPassword);
    var hashedPwd = hashedPassword;
    // Comparing passwords
    //compare() procèdera au hachage de la chaine : "plainPassword"; puis, elle la compare avec la chaine : hashedPassword
    bcrypt.compare("plainPassword", hashedPassword)
      .then(isMatch => {
        if (isMatch) {
          console.log('Password match!');
        } else {
          console.log('Password does not match!');
        }
      })
      .catch(error => {
        console.error('Error comparing passwords:', error);
      });
  })
  .catch(error => {
    console.error('Error hashing password:', error);
  });

  console.log("hashedPwd : " + hashedPwd); */

const bcrypt = require('bcrypt');
const fixedsalt = '$2b$10$J9p8h1TEhTN6hjkf0p6f2O';

async function generateHashedPassword() {
  try {
    const hashedPassword = await bcrypt.hash("plainPassword", fixedsalt);
    //console.log('Hashed password:', hashedPassword);

    // Comparing passwords
    const isMatch = await bcrypt.compare("plainPassword", hashedPassword);
    if (isMatch) {
      console.log('Password match!');
    } else {
      console.log('Password does not match!');
    }

    // Return the hashedPassword
    return hashedPassword;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/*generateHashedPassword()
  .then(hashedPwd => {
    // Now you can access the hashed password value here
    console.log("hashedPwd : " + hashedPwd);
  })
  .catch(error => {
    console.error('Error:', error);
  });*/

  (async () => {
  const ghp = await generateHashedPassword();

  console.log("ghp : " + ghp)
  })();
