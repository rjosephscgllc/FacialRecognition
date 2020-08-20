const handleSignin = (req,res,db,bcrypt) => {
	const { email, password} = req.body
    if(!email||!password){
        res.status(400).json('incorrect form submission')
    }
	// bcrypt.compare("apple", '$2a$10$m.xxkKeAwfO8tmc4ORCWVenXES9jIqOMH.8IW05FbqtnmUdNg4Zvu', function(err, res) {
 //     console.log('first guess',res)
 //    });
 //    bcrypt.compare("veggies", '$2a$10$m.xxkKeAwfO8tmc4ORCWVenXES9jIqOMH.8IW05FbqtnmUdNg4Zvu', function(err, res) {
 //      console.log('second guess',res)
 //    });
   
    db.select('email','hash').from('login')
      .where('email','=',email)
      .then(data => {
      	    const isValid = bcrypt.compareSync(password,data[0].hash);
      	    if (isValid){
      	    	return db.select('*').from('users')
      	    	  .where('email', '=', email)
      	    	  .then(user=> {
      	    	  	res.json(user[0])
      	    	  })
      	          .catch(err=>res.status(400).json('unable to get user'))
      	    
      }else{
      	res.status(400).json('wrong credentials')
      }})
      .catch(err=>res.status(400).json('wrong credentials'))
     
     };      	
module.exports = {
	handleSignin:handleSignin
}