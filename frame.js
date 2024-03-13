class Frame
{
    constructor(x,y,w,h, label, color_r, color_g, color_b)
    {
        this.x      = x;
        this.y      = y;
        this.width  = w;
        this.height = h;
        this.label  = label;
        this.color_r = color_r;
        this.color_g = color_g;
        this.color_b = color_b;
    }

    draw()
    {
        push(); // Save the current drawing style

        // Draw target outline
        noFill();
        stroke(color(this.color_r, this.color_g, this.color_b));
        rect(this.x, this.y, this.width, this.height);

        // Draw label
        textFont("Arial", 36);
        fill(color(this.color_r, this.color_g, this.color_b));
        textAlign(TOP); // Align label to top and center
        text(this.label, this.x + this.width/2, this.y);

        pop(); // Restore the previous drawing style
    }

    // TO-DO: Add hover action!!!
}