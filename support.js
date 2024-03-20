// Support variables & functions (DO NOT CHANGE!)

let student_ID_form, display_size_form, start_button;                  // Initial input variables
let student_ID, display_size;                                          // User input parameters
let additional_text;
let text2;

// Prints the initial UI that prompts that ask for student ID and screen size
function drawUserIDScreen() {

  console.log(img);

  background(color(0,0,0)); // sets background to black

  // Text prompt
  main_text = createDiv("Insert your student number and display size");
  main_text.id('main_text');
  main_text.position(10, 10);

  // Input forms:
  // 1. Student ID
  let student_ID_pos_y_offset = main_text.size().height + 40; // y offset from previous item

  student_ID_form = createInput(''); // create input field
  student_ID_form.position(200, student_ID_pos_y_offset);

  student_ID_label = createDiv("Student number (int)"); // create label
  student_ID_label.id('input');
  student_ID_label.position(10, student_ID_pos_y_offset);

  // 2. Display size
  let display_size_pos_y_offset = student_ID_pos_y_offset + student_ID_form.size().height + 20;

  display_size_form = createInput(''); // create input field
  display_size_form.position(200, display_size_pos_y_offset);

  display_size_label = createDiv("Display size in inches"); // create label
  display_size_label.id('input');
  display_size_label.position(10, display_size_pos_y_offset);

  // 3. Start button
  start_button = createButton('START');
  start_button.mouseReleased(startTest);
  start_button.position(width/6 - start_button.size().width/2, height/4 - start_button.size().height/2);

  // Additional text
  additional_text = createP("<b>Como jogar:</b><br><br><li> Identifique o grupo ao qual pertence o alvo, de acordo com as duas primeiras letras;</li><br><li> Dentro de cada grupo, o nome dos alvos está ordenado alfabeticamente;</li><br><li> Clique no alvo pedido.</li>");
  additional_text.style('color', 'white'); // Set text color to white
  additional_text.position(10, height - 480); // Position the text element
  additional_text.style('font-family', 'Arial'); // Set font to Arial


  text2 = createP("<b>Disposição dos alvos </b>");
  text2.style('color', 'white'); // Set text color to white
  text2.position(250, additional_text.position().y + 130); // Position the text element
  text2.style('font-family', 'Arial'); // Set font to Arial


  image(img, 90, additional_text.position().y + 140, 192*3, 108*3);


}


// Verifies if the student ID is a number, and within an acceptable range
function validID()
{
  if(parseInt(student_ID_form.value()) < 200000 && parseInt(student_ID_form.value()) > 1000) return true
  else 
  {
    alert("Please insert a valid student number (integer between 1000 and 200000)");
	return false;
  }
}

// Verifies if the display size is a number, and within an acceptable range (>13")
function validSize()
{
  if (parseInt(display_size_form.value()) < 50 && parseInt(display_size_form.value()) >= 13) return true
  else
  {
    alert("Please insert a valid display size (between 13 and 50)");
    return false;
  }
}

// Starts the test (i.e., target selection task)
function startTest()
{
  if (validID() && validSize())
  {
    // Saves student and display information
    student_ID = parseInt(student_ID_form.value());
    display_size = parseInt(display_size_form.value());

    // Deletes UI elements
    main_text.remove();
    student_ID_form.remove();
    student_ID_label.remove();
    display_size_form.remove();
    display_size_label.remove();
    start_button.remove();  
    additional_text.remove();

    // Goes fullscreen and starts test
    fullscreen(!fullscreen());
  }
}

// Randomize the order in the targets to be selected
function randomizeTrials()
{
  trials = [];      // Empties the array
    
  // Creates an array with random items from the "legendas" CSV
  for (var i = 0; i < NUM_OF_TRIALS; i++) trials.push(floor(random(legendas.getRowCount())));

  print("trial order: " + trials);   // prints trial order - for debug purposes
}