import { FormateDate } from "../utils/format-date";

describe('works', () => {
  it('returns the expected value', () => {
    expect(FormateDate(1681219054000)).toBe('11.4.2023');
    expect(FormateDate(1652353954000)).toBe('12.5.2022');
    expect(FormateDate(1667473954000)).toBe('3.11.2022');
    expect(FormateDate(1672744354000)).toBe('3.1.2023');
  });
});