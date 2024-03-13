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
  }
  
  // Checks if a mouse click took place
  // within the target
  clicked(mouse_x, mouse_y)
  {
    return dist(this.x, this.y, mouse_x, mouse_y) < this.width / 2;
  }
  
  
  // Draws the target (i.e., a circle)
  // and its label
  draw()
  {
    // Draw target
    fill(color(this.color_r, this.color_g, this.color_b));
    circle(this.x, this.y, this.width);
    
    // Draw label
    textFont("Arial", 16); // Original value was 12
    fill(color(255,255,255));
    textAlign(CENTER);
    text(this.label, this.x, this.y);
  }


  hover() {
    push(); // Save the current drawing style

    fill(color(this.color_r * 0.5, this.color_g * 0.5, this.color_b * 0.5));
    /*
    stroke(color(this.color_r-50, this.color_g-50, this.color_b-50));
    strokeWeight(2); // Add outline thickness
    */
    circle(this.x, this.y, this.width);
    
    // Draw label
    textFont("Arial", 16); // Original value was 12
    noStroke(); // Remove stroke for the text
    fill(color(255,255,255));
    textAlign(CENTER);
    text(this.label, this.x, this.y);

    pop(); // Restore the previous drawing style
  }
}