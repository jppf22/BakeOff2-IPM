class Frame {
    constructor(x, y, w, h, label, label_pos, color_r, color_g, color_b, targets_arr) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.label = label;
        this.label_pos = label_pos; // 0 = top, 1 = bottom, 2 = left, 3 = right
        this.color_r = color_r;
        this.color_g = color_g;
        this.color_b = color_b;
        this.targets_arr = targets_arr;
    }

    hovered(mouse_x, mouse_y) {
        return (
            (

                mouse_x > this.x &&
                mouse_x < this.x + this.width &&
                mouse_y > this.y &&
                mouse_y < this.y + this.height
            )
            ||
            (
                mouse_x-45 > this.x &&
                mouse_x-45 < this.x + this.width &&
                mouse_y-45 > this.y &&
                mouse_y-45 < this.y + this.height
            )
            ||
            (
                mouse_x+45 > this.x &&
                mouse_x+45 < this.x + this.width &&
                mouse_y+45 > this.y &&
                mouse_y+45 < this.y + this.height
            )
            ||
            (
                mouse_x-45 > this.x &&
                mouse_x-45 < this.x + this.width &&
                mouse_y+45 > this.y &&
                mouse_y+45 < this.y + this.height
            )
            ||
            (
                mouse_x+45 > this.x &&
                mouse_x+45 < this.x + this.width &&
                mouse_y-45 > this.y &&
                mouse_y-45 < this.y + this.height
            )
        );
    }

    hover() {
        push(); // Save the current drawing style

        // Draw filled rectangle with darker and 50% transparent color
        fill(color(this.color_r, this.color_g, this.color_b, 127));
        rect(this.x, this.y, this.width, this.height);

        this.draw_label();

        pop(); // Restore the previous drawing style
    }

    stopHover() {
        push(); // Save the current drawing style

        // Draw target outline
        noFill();
        stroke(color(this.color_r, this.color_g, this.color_b));
        rect(this.x, this.y, this.width, this.height);

        this.draw_label();

        pop(); // Restore the previous drawing style
    }

    draw_label() {
        // Draw label
        textFont("Arial", 36);
        fill(color(this.color_r, this.color_g, this.color_b));
        textAlign(CENTER); // Align label to center

        if (this.label_pos === 0) text(this.label, this.x + this.width / 2, this.y - 10); // Adjust the y-coordinate to display the label above the frame
        else if(this.label_pos === 1) text(this.label, this.x + this.width / 2, this.y + this.height + 40); // Adjust the y-coordinate to display the label below the frame
        else if(this.label_pos === 2) text(this.label, this.x - this.width*0.28, this.y + this.height / 2); // Adjust the x-coordinate to display the label to the left of the frame
        else if(this.label_pos === 3) text(this.label, this.x + this.width + this.width*0.28 , this.y + this.height / 2); // Adjust the x-coordinate to display the label to the right of the frame
    }

    get_target_arr() {
        return this.targets_arr;
    }
}
