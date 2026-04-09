export const generateVCard = (user) => {
    const vCard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${user.name}`,
        `N:${user.name};;;;`,
        `EMAIL;TYPE=INTERNET;TYPE=HOME:${user.email}`,
        `TEL;TYPE=CELL:${user.phone}`,
        'END:VCARD'
    ].join('\n');

    const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${user.name.replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
