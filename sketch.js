// Bake-off #2 -- Seleção em Interfaces Densas
// IPM 2023-24, Período 3
// Entrega: até às 23h59, dois dias úteis antes do sexto lab (via Fenix)
// Bake-off: durante os laboratórios da semana de 18 de Março

// p5.js reference: https://p5js.org/reference/

// Database (CHANGE THESE!)
const GROUP_NUMBER        = 57;      // Add your group number here as an integer (e.g., 2, 3)
const RECORD_TO_FIREBASE  = false;  // Set to 'true' to record user results to Firebase

// Pixel density and setup variables (DO NOT CHANGE!)
let PPI, PPCM;
const NUM_OF_TRIALS       = 12;     // The numbers of trials (i.e., target selections) to be completed
let continue_button;
let legendas;                       // The item list from the "legendas" CSV

// Metrics (DO NOT CHANGE!)
let testStartTime, testEndTime;     // time between the start and end of one attempt (8 trials)
let hits 			      = 0;      // number of successful selections
let misses 			      = 0;      // number of missed selections (used to calculate accuracy)
let database;                       // Firebase DB  

// Study control parameters (DO NOT CHANGE!)
let draw_targets          = false;  // used to control what to show in draw()
let trials;                         // contains the order of targets that activate in the test
let current_trial         = 0;      // the current trial number (indexes into trials array above)
let attempt               = 0;      // users complete each test twice to account for practice (attemps 0 and 1)

// Target and Frame list and layout variables
// NOTA: AS FONTS VÃO SER IGNORADAS, NO ENTANTO DEIXAR TAR
let targets               = [];
const ELEMENTS            = 80;     // number of different targets
const ELEMENTS_A          = 27;
const FONT_TITLE_A        = 90;
const ELEMENTS_É          =  1;
const FONT_TITLE_É        = 70;
const ELEMENTS_E          =  10;
const FONT_TITLE_E        = 65; 
const ELEMENTS_H          =  3;
const FONT_TITLE_H        = 56;
const ELEMENTS_I          =  9;
const FONT_TITLE_I        = 50;
const ELEMENTS_L          =  1;
const FONT_TITLE_L        = 70;
const ELEMENTS_N          =  1;
const FONT_TITLE_N        = 70;
const ELEMENTS_O          =  4;
const FONT_TITLE_O        = 50;
const ELEMENTS_R          =  13;
const FONT_TITLE_R        = 57;
const ELEMENTS_U          =  10;
const FONT_TITLE_U        = 70;
const ELEMENTS_Y          =  1;
const FONT_TITLE_Y        = 70;

let frames                = [];
const N_FRAMES            = 10;     // number of frames to be drawn   
let img;

const A_START_X = 150;  
const A_START_Y = 120;

let cursor_size;

// Ensures important data is loaded before the program starts
function preload()
{
  // id,name,...
  img = loadImage('bakeoff2.jpg');
  legendas = loadTable('legendas.csv', 'csv', 'header');
}

// Runs once at the start
function setup()
{
  createCanvas(720, 600);    // window size in px before we go into fullScreen()
  frameRate(60);             // frame rate (DO NOT CHANGE!)
  
  randomizeTrials();         // randomize the trial order at the start of execution
  drawUserIDScreen();        // draws the user start-up screen (student ID and display size)
}

// Runs every frame and redraws the screen
function draw()
{
  if (draw_targets && attempt < 2)
  {     
    // Set cursor to a circle with around 1 cm of diameter
    //cursor('Cursor_Test.png',45,45);

    // The user is interacting with the 6x3 target grid
    background(color(0,0,0));        // sets background to black
    
    // Print trial count at the top left-corner of the canvas
    textFont("Arial", 16);
    fill(color(255,255,255));
    textAlign(LEFT);
    text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);
    

    let frame_hovered_check = false;
    let closestTarget = null;
    let closestDistance = Infinity;

    for (var i = 0; i < frames.length; i++) {
      var targets_arr = frames[i].get_target_arr();
      for(var j = 0; j < targets_arr.length; j++){
        let distance = dist(mouseX, mouseY, targets[targets_arr[j]].x, targets[targets_arr[j]].y);
        if (distance < closestDistance && distance < targets[targets_arr[j]].width / 2) {
          closestTarget = targets[targets_arr[j]];
          closestDistance = distance;
        }
        if(frames[i].hovered(mouseX, mouseY)){
          if(frame_hovered_check == false){
            frames[i].hover();
            frame_hovered_check = true;
          }
          targets[targets_arr[j]].is_cursor_on_frame = true;
        }
        else{
          targets[targets_arr[j]].is_cursor_on_frame = false;
        }
        targets[targets_arr[j]].draw();
      }

      if (!frames[i].hovered(mouseX, mouseY)) {
        frames[i].stopHover();
      }
    }

    if(closestTarget){
      closestTarget.hover();
    }

    // Draws the target label to be selected in the current trial. We include 
    // a black rectangle behind the trial label for optimal contrast in case 
    // you change the background colour of the sketch (DO NOT CHANGE THESE!)
    fill(color(0,0,0));
    rect(0, height - 40, width, 40);

    textFont("Arial", 20); 
    fill(color(255,255,255)); 
    textAlign(CENTER); 
    text(legendas.getString(trials[current_trial],1), width/2, height - 20);
  }
}

// Print and save results at the end of 54 trials
function printAndSavePerformance()
{
  // DO NOT CHANGE THESE! 
  let accuracy			= parseFloat(hits * 100) / parseFloat(hits + misses);
  let test_time         = (testEndTime - testStartTime) / 1000;
  let time_per_target   = nf((test_time) / parseFloat(hits + misses), 0, 3);
  let penalty           = constrain((((parseFloat(95) - (parseFloat(hits * 100) / parseFloat(hits + misses))) * 0.2)), 0, 100);
  let target_w_penalty	= nf(((test_time) / parseFloat(hits + misses) + penalty), 0, 3);
  let timestamp         = day() + "/" + month() + "/" + year() + "  " + hour() + ":" + minute() + ":" + second();
  
  textFont("Arial", 18);
  background(color(0,0,0));   // clears screen
  fill(color(255,255,255));   // set text fill color to white
  textAlign(LEFT);
  text(timestamp, 10, 20);    // display time on screen (top-left corner)
  
  textAlign(CENTER);
  text("Attempt " + (attempt + 1) + " out of 2 completed!", width/2, 60); 
  text("Hits: " + hits, width/2, 100);
  text("Misses: " + misses, width/2, 120);
  text("Accuracy: " + accuracy + "%", width/2, 140);
  text("Total time taken: " + test_time + "s", width/2, 160);
  text("Average time per target: " + time_per_target + "s", width/2, 180);
  text("Average time for each target (+ penalty): " + target_w_penalty + "s", width/2, 220);

  // Saves results (DO NOT CHANGE!)
  let attempt_data = 
  {
        project_from:       GROUP_NUMBER,
        assessed_by:        student_ID,
        test_completed_by:  timestamp,
        attempt:            attempt,
        hits:               hits,
        misses:             misses,
        accuracy:           accuracy,
        attempt_duration:   test_time,
        time_per_target:    time_per_target,
        target_w_penalty:   target_w_penalty,
  }
  
  // Sends data to DB (DO NOT CHANGE!)
  if (RECORD_TO_FIREBASE)
  {
    // Access the Firebase DB
    if (attempt === 0)
    {
      firebase.initializeApp(firebaseConfig);
      database = firebase.database();
    }
    
    // Adds user performance results
    let db_ref = database.ref('G' + GROUP_NUMBER);
    db_ref.push(attempt_data);
  }
}

// Mouse button was pressed - lets test to see if hit was in the correct target
function mousePressed() 
{
  // Only look for mouse releases during the actual test
  // (i.e., during target selections)
  if (draw_targets)
  {
    let closestTarget = null;
    let closestDistance = Infinity;

    for (var i = 0; i < legendas.getRowCount(); i++)
    {
      // Check if the user clicked over one of the targets
      console.log(targets[i].x, targets[i].y, mouseX, mouseY, targets[i].label);
      if (targets[i].clicked(mouseX, mouseY))
      {
      // Calculate the distance between the target and the cursor
      let distance = dist(targets[i].x, targets[i].y, mouseX, mouseY);

      // Check if this target is closer than the previous closest target
      if (distance < closestDistance) {
        closestTarget = targets[i];
        closestDistance = distance;
      }
      }
    }

    if (closestTarget) {
      // Checks if it was the correct target
      console.log(closestTarget.label, closestTarget.id, trials[current_trial] + 1);

      if (closestTarget.id == trials[current_trial] + 1) {
      hits++;
      console.log(hits);
      }
      else misses++;

      current_trial++;              // Move on to the next trial/target
    }
    
    // Check if the user has completed all trials
    if (current_trial === NUM_OF_TRIALS)
    {
      testEndTime = millis();
      draw_targets = false;          // Stop showing targets and the user performance results
      printAndSavePerformance();     // Print the user's results on-screen and send these to the DB
      attempt++;                      
      
      // If there's an attempt to go create a button to start this
      if (attempt < 2)
      {
        continue_button = createButton('START 2ND ATTEMPT');
        continue_button.mouseReleased(continueTest);
        continue_button.position(width/2 - continue_button.size().width/2, height/2 - continue_button.size().height/2);
      }
    }
    // Check if this was the first selection in an attempt
    else if (current_trial === 1) testStartTime = millis(); 
  }
}


// Evoked after the user starts its second (and last) attempt
function continueTest()
{
  // Re-randomize the trial order
  randomizeTrials();
  
  // Resets performance variables
  hits = 0;
  misses = 0;
  
  current_trial = 0;
  continue_button.remove();
  
  // Shows the targets again
  draw_targets = true; 
}

// Creates and positions the UI targets
function createTargets(target_size, frame_offset_x, frame_offset_y, horizontal_space_1, horizontal_space_2, horizontal_space_3, vertical_space_1, vertical_space_2, vertical_space_3, vertical_space_4, vertical_space_5)
{
  
  let legendasArray = legendas.getArray();
  legendasArray.sort((a, b) => a[1].localeCompare(b[1]));
  console.log(legendasArray);

  //TEMP -!!!!!!
  let frame_horizontal_gap = target_size*0.5;
  let frame_vertical_gap = target_size*0.2;
  
  // Determine target gap and frame gaps
  let target_gaps_horizontal_space_1 = (horizontal_space_1 - frame_horizontal_gap) / (6+5+1 - 1);
  let target_gaps_horizontal_space_2 = (horizontal_space_2 - frame_horizontal_gap) / (6+1+3+1 - 1);
  let target_gaps_horizontal_space_3 = (horizontal_space_3 - frame_horizontal_gap) / (2+6+5 - 1);

  let target_gap_horizontal_a = Math.min(target_gaps_horizontal_space_1, target_gaps_horizontal_space_2);
  let target_gap_horizontal_e = target_gaps_horizontal_space_1;
  let target_gap_horizontal_i = target_gaps_horizontal_space_2;
  let target_gap_horizontal_o = target_gaps_horizontal_space_3;
  let target_gap_horizontal_r = target_gaps_horizontal_space_3;
  let target_gap_horizontal_u = target_gaps_horizontal_space_3;
  
  let target_gap_horizontal = Math.max(Math.min(target_gap_horizontal_a, target_gap_horizontal_e, target_gap_horizontal_i, target_gap_horizontal_o, target_gap_horizontal_r, target_gap_horizontal_u),0);
  
  /*
  let target_gaps_vertical_space_1 = (vertical_space_1 - frame_vertical_gap) / (5+ 2 -1);
  let target_gaps_vertical_space_2 = (vertical_space_2 - frame_vertical_gap) / (5+3 - 1);
  let target_gaps_vertical_space_3 = (vertical_space_3 - frame_vertical_gap) / (2+3+3 - 1);
  let target_gaps_vertical_space_4 = (vertical_space_4 - frame_vertical_gap) / (2+3+2 -1 );
  let target_gaps_vertical_space_5 = (vertical_space_5 - frame_vertical_gap) / (1+1+1+1+2 - 1);

  let target_gap_vertical_a = Math.min(target_gaps_vertical_space_1, target_gaps_vertical_space_2);
  let target_gap_vertical_e = Math.min(target_gaps_vertical_space_3,target_gaps_vertical_space_4);
  let target_gap_vertical_h = target_gaps_vertical_space_3;
  let target_gap_vertical_i = target_gaps_vertical_space_4;
  let target_gap_vertical_o = target_gaps_vertical_space_1;
  let target_gap_vertical_r = target_gaps_vertical_space_2;
  let target_gap_vertical_u = Math.min(target_gaps_vertical_space_4, target_gaps_vertical_space_5);
  */

  //Define the smallest target_gap vertically and horizontally
  /*
  let target_gap_vertical = Math.min(target_gap_vertical_a, target_gap_vertical_e, target_gap_vertical_h, target_gap_vertical_i, target_gap_vertical_o, target_gap_vertical_r, target_gap_vertical_u);
  */
  let target_gap_vertical = 0;


  let a_counter = 0;
  let a_line = 0;
  let is_frame_a_created = false;

  let e_counter = 0;
  let e_line = 0;
  let is_frame_e_created = false;

  let h_counter = 0;
  let is_frame_h_created = false;

  let i_counter = 0;
  let i_line = 0;
  let is_frame_i_created = false;

  let o_counter = 0;
  let o_line = 0;
  let is_frame_o_created = false;

  let r_counter = 0;
  let r_line = 0;
  let is_frame_r_created = false;

  let u_counter = 0;
  let u_line = 0;
  let is_frame_u_created = false;

  let a_x_start = A_START_X;
  let a_y_start = A_START_Y;

  let e_x_start = a_x_start + (target_size + target_gap_horizontal)*5 + target_size + frame_offset_x*2 + frame_horizontal_gap; //
  let e_y_start = a_y_start;

  let h_x_start = e_x_start + frame_horizontal_gap;
  let h_y_start = e_y_start + (target_size + target_gap_vertical) + target_size + frame_offset_y*2 + frame_vertical_gap; //

  let i_x_start = h_x_start + target_size + frame_offset_x*2 + frame_horizontal_gap; //
  let i_y_start = h_y_start;

  let o_x_start = a_x_start;
  let o_y_start = a_y_start + (target_size + target_gap_vertical)*4 + target_size + frame_offset_y*2 + frame_vertical_gap; //

  let r_x_start = o_x_start + (target_size + target_gap_horizontal) + target_size + frame_offset_x*2 + frame_horizontal_gap; //
  let r_y_start = o_y_start; //

  let u_x_start = r_x_start + (target_size + target_gap_horizontal)*4 + target_size + frame_offset_x*2 + frame_horizontal_gap; //

  let é_x_start = e_x_start + (target_size + target_gap_horizontal)*4 + target_size + frame_offset_x*2 + frame_horizontal_gap; //
  let é_y_start = e_y_start;

  let l_x_start = é_x_start;
  let l_y_start = é_y_start + target_size + frame_offset_y*2 + frame_vertical_gap*3;

  let n_x_start = l_x_start;
  let n_y_start = l_y_start + target_size + frame_offset_y*2 + frame_vertical_gap*3;

  let y_x_start = n_x_start;
  let y_y_start = n_y_start + target_size + frame_offset_y*2 + frame_vertical_gap*3;

  let u_y_start = y_y_start + target_size + frame_offset_y*2 + frame_vertical_gap;
  if((y_y_start + target_size + frame_offset_y*2 + frame_vertical_gap) < (i_y_start + (target_size + target_gap_vertical)*3 - target_gap_vertical + frame_offset_y*2 + frame_vertical_gap)){
    u_y_start = i_y_start + (target_size + target_gap_vertical)*3 - target_gap_vertical + frame_offset_y*2 + frame_vertical_gap;
  }


  for(var legendas_index= 0; legendas_index < 80; legendas_index++){
      let target_label = legendasArray[legendas_index][1];
      let target_id = legendasArray[legendas_index][0];
      let target_color = assignTargetColor(target_label);
      let frame_targets = [];

      // NEW CODE --------------------------------
      switch(target_label[1]){
        case 'a':
          target_x = a_x_start + (target_size + target_gap_horizontal)*(a_counter%6); 
          if(a_counter%6 == 0 && a_counter != 0){
            a_line++;
          }
          target_y = a_y_start + (target_size + target_gap_vertical)*a_line;
          a_counter++;

          if(!is_frame_a_created){
            for(var i=legendas_index; i < legendas_index+ELEMENTS_A; i++){
              frame_targets.push(i);
            }
            let frame_a = new Frame(a_x_start - frame_offset_x - target_size/2, a_y_start - frame_offset_y - target_size/2, (target_size + target_gap_horizontal)*6 - target_gap_horizontal + frame_offset_x*2, (target_size+target_gap_vertical)*5 - target_gap_vertical + frame_offset_y*2, "BA", 0 , target_color[0], target_color[1], target_color[2], frame_targets, FONT_TITLE_A); //
            frames.push(frame_a);
            is_frame_a_created = true;
          }

          break;

        // CONTINUAR AQUI!!!!!!!!!!!!!!!!  
        case 'é':
          target_x = é_x_start;
          target_y = é_y_start;

          for(var i=legendas_index; i < legendas_index+ELEMENTS_É; i++){
            frame_targets.push(i);
          }

          let frame_é = new Frame(target_x - frame_offset_x - target_size/2, target_y - frame_offset_y - target_size/2, target_size + frame_offset_x*2, target_size + frame_offset_y*2, "BÉ", 0, target_color[0], target_color[1], target_color[2], frame_targets, FONT_TITLE_É); //
          frames.push(frame_é);

          break;
        case 'e':
          target_x = e_x_start + (target_size + target_gap_horizontal)*(e_counter%5);
          if(e_counter%5 == 0 && e_counter != 0){
            e_line++;
          }
          target_y = e_y_start + (target_size+target_gap_vertical)*e_line;
          e_counter++;

          for(var i=legendas_index; i < legendas_index+ELEMENTS_E; i++){
            frame_targets.push(i);
          }

          if(!is_frame_e_created){
            let frame_e = new Frame(e_x_start - frame_offset_x - target_size/2, e_y_start - frame_offset_y - target_size/2, (target_size + target_gap_horizontal)*5 - target_gap_horizontal + frame_offset_x*2, ((target_size+target_gap_vertical)*2) - target_gap_vertical + frame_offset_y*2, "BE", 0, target_color[0], target_color[1], target_color[2], frame_targets, FONT_TITLE_E); //
            frames.push(frame_e);
            is_frame_e_created = true;
          }
            
          break;
        case 'h':
          target_x = h_x_start;
          target_y = h_y_start + (target_size+target_gap_vertical)*h_counter;
          h_counter++;

          for(var i=legendas_index; i < legendas_index+ELEMENTS_H; i++){
            frame_targets.push(i);
          }

          if(!is_frame_h_created){
            let frame_h = new Frame(h_x_start - frame_offset_x - target_size/2, h_y_start -  frame_offset_y - target_size/2, target_size + frame_offset_x*2, ((target_size+target_gap_vertical)*3)- target_gap_vertical +frame_offset_y*2, "BH", 2 , target_color[0], target_color[1], target_color[2], frame_targets, FONT_TITLE_H); //
            frames.push(frame_h);
            is_frame_h_created = true;
          }

          break;

        case 'i':
          target_x = i_x_start + (target_size + target_gap_horizontal)*(i_counter%3);
          if(i_counter%3 == 0 && i_counter != 0){
            i_line++;
          }
          target_y = i_y_start + (target_size+target_gap_vertical)*i_line;
          i_counter++;
          
          for(var i=legendas_index; i < legendas_index+ELEMENTS_I; i++){
            frame_targets.push(i);
          }

          if(!is_frame_i_created){
            let frame_i = new Frame(i_x_start - frame_offset_x - target_size/2, i_y_start - frame_offset_y - target_size/2, (target_size + target_gap_horizontal)*3 - target_gap_horizontal + frame_offset_x*2, ((target_size+target_gap_vertical)*3) - target_gap_vertical + frame_offset_y*2, "BI", 1, target_color[0], target_color[1], target_color[2], frame_targets, FONT_TITLE_I); //
            frames.push(frame_i);
            is_frame_i_created = true;
          }

          break;
        case 'l':
          target_x = l_x_start;
          target_y = l_y_start;

          for(var i=legendas_index; i < legendas_index+ELEMENTS_L; i++){
            frame_targets.push(i);
          }

          let frame_l = new Frame(target_x - frame_offset_x - target_size/2, target_y - frame_offset_y - target_size/2, target_size + frame_offset_x*2, target_size + frame_offset_y*2, "BL", 0, target_color[0], target_color[1], target_color[2], frame_targets, FONT_TITLE_L); //
          frames.push(frame_l);

          break;
        case 'n':
          target_x = n_x_start;
          target_y = n_y_start;
          
          for(var i=legendas_index; i < legendas_index+ELEMENTS_N; i++){
            frame_targets.push(i);
          }

          let frame_n = new Frame(target_x - frame_offset_x - target_size/2, target_y - frame_offset_y - target_size/2, target_size + frame_offset_x*2, target_size + frame_offset_y*2, "BN", 0, target_color[0], target_color[1], target_color[2], frame_targets, FONT_TITLE_N); //
          frames.push(frame_n);

          break;
        case 'o':
          target_x = o_x_start + (target_size + target_gap_horizontal)*(o_counter%2);
          if(o_counter%2 == 0 && o_counter != 0){
            o_line++;
          }
          target_y = o_y_start + (target_size+target_gap_vertical)*o_line;
          o_counter++;

          for(var i=legendas_index; i < legendas_index+ELEMENTS_O; i++){
            frame_targets.push(i);
          }

          if(!is_frame_o_created){
            let frame_o = new Frame(o_x_start - frame_offset_x - target_size/2, o_y_start - frame_offset_y - target_size/2, (target_size + target_gap_horizontal)*2 - target_gap_horizontal + frame_offset_x*2, ((target_size+target_gap_vertical)*2) - target_gap_vertical + frame_offset_y*2, "BO", 0, target_color[0], target_color[1], target_color[2], frame_targets, FONT_TITLE_O); //
            frames.push(frame_o);
            is_frame_o_created = true;
          }

          break;
        case 'r':
          target_x = r_x_start + (target_size + target_gap_horizontal)*(r_counter%5);
          if(r_counter%5 == 0 && r_counter != 0){
            r_line++;
          }
          target_y = r_y_start + (target_size + target_gap_vertical)*r_line;
          r_counter++;

          for(var i=legendas_index; i < legendas_index+ELEMENTS_R; i++){
            frame_targets.push(i);
          }

          if(!is_frame_r_created){
            let frame_r = new Frame(r_x_start - frame_offset_x - target_size/2, r_y_start - frame_offset_y - target_size/2, (target_size + target_gap_horizontal)*5 - target_gap_horizontal + frame_offset_x*2, ((target_size+target_gap_vertical)*3) - target_gap_vertical + frame_offset_y*2, "BR", 0, target_color[0], target_color[1], target_color[2], frame_targets, FONT_TITLE_R); //
            frames.push(frame_r);
            is_frame_r_created = true;
          }

          break;
        case 'u':
          target_x = u_x_start + (target_size +target_gap_horizontal)*(u_counter%5);
          if(u_counter%5 == 0 && u_counter != 0){
            u_line++;
          }
          target_y = u_y_start + (target_size+target_gap_vertical)*u_line;
          u_counter++;

          for(var i=legendas_index; i < legendas_index+ELEMENTS_U; i++){
            frame_targets.push(i);
          }

          if(!is_frame_u_created){
            let frame_u = new Frame(u_x_start - frame_offset_x - target_size/2, u_y_start - frame_offset_y - target_size/2, (target_size + target_gap_horizontal)*5 - target_gap_horizontal + frame_offset_x*2, ((target_size+target_gap_vertical)*2) - target_gap_vertical + frame_offset_y*2, "BU", 0, target_color[0], target_color[1], target_color[2], frame_targets, FONT_TITLE_U); //
            frames.push(frame_u);
            is_frame_u_created = true;
          }

          break;
        case 'y':
          target_x = y_x_start;
          target_y = y_y_start;

          for(var i=legendas_index; i < legendas_index+ELEMENTS_Y; i++){
            frame_targets.push(i);
          }

          let frame_y = new Frame(target_x - frame_offset_x - target_size/2, target_y - frame_offset_y - target_size/2, target_size + frame_offset_x*2, target_size + frame_offset_y*2, "BY", 0 , target_color[0], target_color[1], target_color[2], frame_targets, FONT_TITLE_Y); //
          frames.push(frame_y);

          break;
        }
      // -----------------------------------------

      let target = new Target(target_x, target_y, target_size, target_label, target_id, target_color[0], target_color[1], target_color[2]);
      console.log(target_label, target_x, target_y, target.id);
      targets.push(target);
  }
}

// Is invoked when the canvas is resized (e.g., when we go fullscreen)
function windowResized() 
{
  if (fullscreen())
  {
    resizeCanvas(windowWidth, windowHeight);
    
    // DO NOT CHANGE THE NEXT THREE LINES!
    let display        = new Display({ diagonal: display_size }, window.screen);
    PPI                = display.ppi;                      // calculates pixels per inch
    PPCM               = PPI / 2.54;                       // calculates pixels per cm
  
    // Make your decisions in 'cm', so that targets have the same size for all participants
    // Below we find out out white space we can have between 2 cm targets
    let screen_width   = display.width * 2.54;             // screen width
    let screen_height  = display.height * 2.54;            // screen height
    let target_size    = 2;                                // sets the target size (will be converted to cm when passed to createTargets)
    
    let frame_offset_x = target_size*0.05;
    let frame_offset_y = target_size*0.02;
    
    /*
    let target_gap     = target_size*0.1;                     
    let frame_horizontal_gap = target_size*0.25;
    let frame_vertical_gap = target_size*0.5;
    */

    let horizontal_space_1 = screen_width - target_size*(6+5+1); //3 frames  = 6 + 5 + 1 alvos
    let horizontal_space_2 = screen_width - target_size*(6+1+3+1); //4 frames = 6 + 1 + 3 + 1 alvos
    let horizontal_space_3 = screen_width - target_size*(2+6+5); //3 frames = 2 + 6 + 5 alvos 
    
    let vertical_space_1 = screen_height - target_size*(5+2); //2 frames = 5 + 2 alvos
    let vertical_space_2 = screen_height - target_size*(5+3);//2 frames = 5 + 3 alvos
    let vertical_space_3 = screen_height - target_size*(2+3+3);// 3 frames = 2 + 3 + 3  alvos
    let vertical_space_4 = screen_height - target_size*(2+3+2);// 3 frames = 2 + 3 + 2 alvos
    let vertical_space_5 = screen_height - target_size*(1+1+1+1+2);// 5 frames = 1 + 1 + 1 + 1 + 2 alvos

    createTargets(target_size * PPCM, frame_offset_x * PPCM, frame_offset_y * PPCM, horizontal_space_1*PPCM - A_START_X, horizontal_space_2*PPCM - A_START_X, horizontal_space_3*PPCM - A_START_X, vertical_space_1*PPCM - A_START_Y, vertical_space_2*PPCM - A_START_Y, vertical_space_3*PPCM - A_START_Y, vertical_space_4*PPCM - A_START_Y, vertical_space_5*PPCM - A_START_Y);

    // Starts drawing targets immediately after we go fullscreen
    draw_targets = true;
  }
}


// OUR FUNCTIONS ---------------------------

function assignTargetColor(target_label){
  let color_r = 0;
  let color_g = 0;
  let color_b = 0;

  switch(target_label[1]){
    case "a":
      color_r = 128;
      color_g = 128;
      color_b = 128; // Dark Gray
      break;
    case "e":
      color_r = 0;
      color_g = 0;
      color_b = 205; // Medium Blue
      break;
    case "h":
      color_r = 138;
      color_g = 43;
      color_b = 226; // Deep Purple
      break;
    case "i":
      color_r = 34;
      color_g = 139;
      color_b = 34; // Forest Green
      break;
    case "l":
      color_r = 255;
      color_g = 0;
      color_b = 0; // Vivid Red
      break;
    case "n":
      color_r = 255;
      color_g = 165;
      color_b = 0; // Bright Orange
      break;
    case "o":
      color_r = 92;
      color_g = 119;
      color_b = 130; // Dark Blue
      break;
    case "r":
      color_r = 32;
      color_g = 178;
      color_b = 170; // Seafoam Green
      break;
    case "u":
      color_r = 139;
      color_g = 69;
      color_b = 19; // Brown
      break;
    case "y":
      color_r = 154;
      color_g = 205;
      color_b = 50; // YellowGreen
      break;
    case "é":
      color_r = 147;
      color_g = 112;
      color_b = 219; // MediumPurple
      break;
  }

  return [color_r, color_g, color_b];
}
