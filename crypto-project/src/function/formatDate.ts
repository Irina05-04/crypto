export const FormateDate = (date: number) => {
    const day = new Date(date);
    return `${day.getDate()}.${day.getMonth()}.${day.getFullYear()}`
}