import { jsPDF } from 'jspdf';
import { toast } from 'react-hot-toast';

/**
 * Utility to convert image URL to Base64 with optional circular cropping
 */
const getBase64ImageFromURL = (url, isRound = false) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const size = Math.min(img.width, img.height);
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            if (isRound) {
                ctx.beginPath();
                ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
            }
            
            // Draw centered square crop
            ctx.drawImage(
                img, 
                (img.width - size) / 2, (img.height - size) / 2, size, size, 
                0, 0, size, size
            );
            
            const dataURL = canvas.toDataURL('image/png');
            resolve(dataURL);
        };
        img.onerror = (error) => reject(error);
        img.src = url;
    });
};

/**
 * PDF Generator Utility
 * Generates an ultra-premium rectangular digital business card
 */
export const downloadPDF = async (business) => {
    try {
        if (!business || !business.name) {
            toast.error("Business data incomplete for PDF");
            return;
        }

        const {
            name = 'Business',
            phone = 'N/A',
            email = '',
            address = '',
            city = {},
            website = '',
            category = {},
            slug = '',
            images = [],
            logo = '',
            coverImage = ''
        } = business;

        const doc = new jsPDF({
            orientation: 'l',
            unit: 'mm',
            format: [130, 80] // Slightly larger for premium readability
        });

        const primaryColor = [249, 115, 22]; // Vibrant Orange (#f97316)
        const bgColor = [15, 23, 42]; // Deep Midnight Blue (#0f172a)
        const textColor = [255, 255, 255]; // White
        const textGrey = [148, 163, 184]; // Slate 400

        // --- Background & Decorative Borders ---
        doc.setFillColor(...bgColor);
        doc.rect(0, 0, 130, 80, 'F');
        
        // Vibrant Orange Top & Left Accent
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 130, 2, 'F');
        doc.rect(0, 0, 4, 80, 'F');

        // --- Business Name & Branding (Dynamic Font Sizing) ---
        doc.setTextColor(...textColor);
        doc.setFont('helvetica', 'bold');
        
        let businessNameSize = 28;
        doc.setFontSize(businessNameSize);
        const maxNameWidth = 65; // Available width before it hits the profile image area
        const upperName = name.toUpperCase();
        
        // Auto-scale font size if name is too long
        while (doc.getTextWidth(upperName) > maxNameWidth && businessNameSize > 14) {
            businessNameSize -= 1;
            doc.setFontSize(businessNameSize);
        }
        
        doc.text(upperName, 15, 18);

        doc.setFontSize(11); 
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...primaryColor);
        doc.text(category?.name?.toUpperCase() || 'OFFICIAL PREMIUM PARTNER', 15, 25);

        // --- Contact Information (Aligned Left) ---
        const startY = 42;
        const rowHeight = 9;

        const drawFieldWithIcon = (type, value, y) => {
            if (!value) return;
            const iconSize = 3.5;
            const iconX = 15;
            const textX = 22;
            const iconY = y - iconSize + 0.5;

            doc.setDrawColor(...primaryColor);
            doc.setLineWidth(0.4);

            if (type === 'phone') {
                doc.roundedRect(iconX, iconY, iconSize * 0.6, iconSize, 0.5, 0.5, 'S');
                doc.circle(iconX + iconSize * 0.3, iconY + iconSize * 0.8, 0.2, 'S');
            } else if (type === 'email') {
                doc.rect(iconX, iconY + iconSize * 0.2, iconSize, iconSize * 0.6, 'S');
                doc.line(iconX, iconY + iconSize * 0.2, iconX + iconSize/2, iconY + iconSize/2);
                doc.line(iconX + iconSize, iconY + iconSize * 0.2, iconX + iconSize/2, iconY + iconSize/2);
            } else if (type === 'web') {
                doc.circle(iconX + iconSize/2, iconY + iconSize/2, iconSize/2, 'S');
                doc.line(iconX, iconY + iconSize/2, iconX + iconSize, iconY + iconSize/2);
                doc.ellipse(iconX + iconSize/2, iconY + iconSize/2, iconSize/4, iconSize/2, 'S');
            } else if (type === 'address') {
                doc.circle(iconX + iconSize/2, iconY + iconSize/3, iconSize/3, 'S');
                doc.line(iconX + iconSize/2, iconY + iconSize, iconX + iconSize/2 - 1, iconY + iconSize * 0.6);
                doc.line(iconX + iconSize/2, iconY + iconSize, iconX + iconSize/2 + 1, iconY + iconSize * 0.6);
            }

            doc.setTextColor(...textColor);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            doc.text(value, textX, y);
        };

        drawFieldWithIcon('phone', phone, startY);
        drawFieldWithIcon('email', (email || `contact@${slug || 'bizdirect'}.com`).toLowerCase(), startY + rowHeight);
        drawFieldWithIcon('web', `bizdirect.global/b/${slug || 'profile'}`, startY + rowHeight * 2);

        // Address (Wrapped)
        const iconY = startY + rowHeight * 3 - 3;
        const iconX = 15;
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.3);
        doc.circle(iconX + 1.75, iconY + 1.2, 1.2, 'S');
        doc.line(iconX + 1.75, iconY + 3.5, iconX + 0.75, iconY + 2.2);
        doc.line(iconX + 1.75, iconY + 3.5, iconX + 2.75, iconY + 2.2);

        doc.setTextColor(...textColor);
        doc.setFont('helvetica', 'normal');
        const cityName = city?.name || 'Gujarat';
        const fullAddress = `${address}, ${cityName}`;
        const splitAddress = doc.splitTextToSize(fullAddress, 55);
        doc.text(splitAddress, 22, startY + rowHeight * 3);

        // --- Business Visual (Perfect Round Image - Pre-clipped) ---
        const imageToUse = coverImage || (images && images[0]) || logo;
        const imgSize = 38; 
        const imgX = 85; 
        const imgY = 16; // Shifted slightly UP for better visual balance

        if (imageToUse) {
            try {
                const imgBase64 = await getBase64ImageFromURL(imageToUse, true);
                
                doc.setDrawColor(...primaryColor);
                doc.setLineWidth(1.5);
                doc.circle(imgX + imgSize/2, imgY + imgSize/2, imgSize/2 + 1, 'S');

                doc.addImage(imgBase64, 'PNG', imgX, imgY, imgSize, imgSize);
                
            } catch (imgError) {
                console.warn("Could not load image, falling back to initials", imgError);
                drawInitialsCircle(doc, name, primaryColor, imgX + imgSize/2, imgY + imgSize/2, imgSize/2);
            }
        } else {
            drawInitialsCircle(doc, name, primaryColor, imgX + imgSize/2, imgY + imgSize/2, imgSize/2);
        }

        // --- Branding Footer ---
        doc.setFontSize(6.5);
        doc.setTextColor(...textGrey);
        doc.text('OFFICIAL DIGITAL CARD • POWERED BY BIZDIRECT GLOBAL', 66, 78, { align: 'center' });

        // Save and download
        const fileName = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_card.pdf`;
        doc.save(fileName);
        toast.success("Professional card downloaded!");

    } catch (error) {
        console.error("PDF Error:", error);
        toast.error("Failed to generate PDF. Please try again.");
    }
};

/**
 * Fallback helper to draw initials circle
 */
const drawInitialsCircle = (doc, name, color, x, y, radius) => {
    doc.setFillColor(...color);
    doc.circle(x, y, radius, 'F'); 
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(radius * 1.2);
    doc.setFont('helvetica', 'bold');
    
    const words = name.trim().split(/\s+/);
    const initials = words.slice(0, 2).map(w => w.charAt(0).toUpperCase()).join('');
    const displayInitials = initials || 'BD';
    
    doc.text(displayInitials, x, y + (radius * 0.3), { align: 'center' });
};

