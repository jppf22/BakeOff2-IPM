// Target class (position and width)
class Target
{
  constructor(x, y, w, l, id, color_r, color_g, color_b)
  {
    this.x      = x;
    this.y      = y;
    this.width  = w;
    this.label  = l;
    this.id     = id;
    this.color_r = color_r;
    this.color_g = color_g;
    this.color_b = color_b;
    this.is_cursor_on_frame = false;
  }
  
  // Checks if a mouse click took place
  // within the target
  clicked(mouse_x, mouse_y)
  {
    return (dist(this.x, this.y, mouse_x, mouse_y) < this.width / 2 /*|| dist(this.x,this.y,mouse_x-45,mouse_y-45) < this.width / 2 || dist(this.x,this.y,mouse_x+45,mouse_y+45) < this.width / 2 || dist(this.x,this.y,mouse_x-45,mouse_y+45) < this.width / 2 || dist(this.x,this.y,mouse_x+45,mouse_y-45) < this.width / 2*/);
  }
  
  
  // Draws the target (i.e., a circle)
  // and its label
  draw()
  {
    // Draw target
    fill(color(this.color_r, this.color_g, this.color_b));
    circle(this.x, this.y, this.width);
    
    // Draw label
    textFont("Arial", 14); // Original value was 12
    fill(color(255,255,255));
    if (this.is_cursor_on_frame) {
      textFont("Arial", 18); // Original value was 12
      textAlign(RIGHT);
      fill(color(255, 255, 0)); // Yellow color
      const remainingChars = this.label.length - 3;
      const xOffset = remainingChars * 2;
      text(this.label.substring(0, 3), this.x - xOffset, this.y);
      textFont("Arial", 14); // Original value was 12
      textAlign(LEFT);
      fill(color(255, 255, 255)); // White color
      text(this.label.substring(3), this.x - xOffset, this.y);
    } else {
      textAlign(CENTER);
      text(this.label, this.x, this.y);
    }
  }


  hover() {
    push(); // Save the current drawing style

    fill(color(this.color_r * 0.5, this.color_g * 0.5, this.color_b * 0.5));
    circle(this.x, this.y, this.width);
    
    // Draw label
    noStroke(); // Remove stroke for the text
    fill(color(255,255,255));
    if (this.is_cursor_on_frame) {
      textFont("Arial", 18); // Original value was 12
      textAlign(RIGHT);
      fill(color(255, 255, 0)); // Yellow color
      const remainingChars = this.label.length - 3;
      const xOffset = remainingChars * 2;
      text(this.label.substring(0, 3), this.x - xOffset, this.y);
      textFont("Arial", 14); // Original value was 12
      textAlign(LEFT);
      fill(color(255, 255, 255)); // White color
      text(this.label.substring(3), this.x - xOffset, this.y);
    } else {
      textAlign(CENTER);
      text(this.label, this.x, this.y);
    }

    pop(); // Restore the previous drawing style
  }
}