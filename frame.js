class Frame {
    constructor(x, y, w, h, label, label_pos, color_r, color_g, color_b, targets_arr, font_size) {
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
        this.font_size = font_size;
    }

    hovered(mouse_x, mouse_y) {
        return (
            (

                mouse_x > this.x &&
                mouse_x < this.x + this.width &&
                mouse_y > this.y &&
                mouse_y < this.y + this.height
            )
            /*
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
            */
        );
    }

    hover() {
        push(); // Save the current drawing style

        // Draw filled rectangle with darker and 50% transparent color
        fill(color(this.color_r, this.color_g, this.color_b, 127));
        rect(this.x, this.y, this.width, this.height);

        pop(); // Restore the previous drawing style
    }

    stopHover() {
        push(); // Save the current drawing style

        // Draw target outline
        fill(color(this.color_r, this.color_g, this.color_b, 150));
        stroke(color(this.color_r, this.color_g, this.color_b));
        rect(this.x, this.y, this.width, this.height);

        this.draw_label();

        pop(); // Restore the previous drawing style
    }

    draw_label() {
        // Calculate the maximum font size that fits within the frame
        const maxFontSize = Math.min(this.width*1.2, this.height*1.2)*0.8;
        
        // Draw label
        textFont("Arial", maxFontSize);
        
        // Adjust color based on lightness
        const lightness = (this.color_r + this.color_g + this.color_b) / 3;
        const adjustedColor = lightness > 127 ? color(this.color_r + 63, this.color_g + 63, this.color_b + 63) : color(this.color_r + 145, this.color_g + 145, this.color_b + 145);
        
        fill(adjustedColor);
        textAlign(CENTER,CENTER); // Align label to center
        
        // Calculate the position of the label
        
        const labelX = this.x + this.width / 2;
        const labelY = this.y + this.height / 2;
        
        text(this.label, labelX, labelY);
    }

    get_target_arr() {
        return this.targets_arr;
    }
}
