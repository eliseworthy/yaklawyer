<?php
	//****************************************
	//edit here
	$to = 'india@indialinbodienlaw.com';
	//****************************************

	// mail headers
	$headers =	'From: '.$to."\r\n".
				'Reply-To: '.$to."\r\n".
				'X-Mailer: PHP/'.phpversion();

	// mail content
	$temp = '';
	foreach($_POST as $key => $value){
		if($key != 'subject') $temp = $temp.$key." : ".$value."\n\n";
	}

	// send mail
	mail($to, $_POST['subject'], "\n".$temp, $headers);

	echo '{Thank you! Your email was accepted.}';
?>