export class Packer<Item extends { length: number }> {
    public readonly maxLength: number;
    private packed_: Readonly<{ start: number, item: Item }>[];

    public get packed() {
        return this.packed_.slice();
    }

    constructor(maxLength: number) {
        this.maxLength = maxLength;
        this.packed_ = [];
    }

    public findIndex(address: number) {
        const index = this.packed_.findIndex((slot) => slot.start > address);
        return index >= 0 ? index : this.packed_.length;
    };

    public checkFit(start: number, length: number) {
        const startPos = this.findIndex(start);
        const endPos = this.findIndex(start + length);
        const previousEnd = startPos > 0
            ? this.packed_[startPos - 1].start + this.packed_[startPos - 1].item.length
            : 0;
        const nextStart = endPos < this.packed_.length - 1
            ? this.packed_[endPos + 1].start + this.packed_[endPos + 1].item.length
            : this.maxLength;
        return start >= previousEnd && start + length <= nextStart;
    };

    public clone() {
        let clone = new Packer<Item>(this.maxLength);
        this.packed_.forEach(x => clone.packed_.push({ start: x.start, item: x.item }));
        return clone;
    }

    public insertAt(start: number, item: Item): boolean {
        if (this.checkFit(start, item.length)) {
            this.packed_.splice(this.findIndex(start), 0, { start: start, item: item });
            return true;
        } else {
            return false;
        }
    }

    private *_freeSpaces() {
        let lastEnd = 0;
        for (let i of this.packed_.keys()) {
            let packed = this.packed_[i];
            if (packed.start > lastEnd) {
                yield { index: i, start: lastEnd, length: packed.start - lastEnd };
            }
            lastEnd = packed.start + packed.item.length;
        }
        if (this.packed_.length > 0) {
            const last = this.packed_[this.packed_.length - 1];
            const start = last.start + last.item.length;
            const length = this.maxLength - start;
            if (length > 0) {
                yield { index: this.packed_.length, start: start, length: length };
            }
        } else {
            yield { index: 0, start: 0, length: this.maxLength };
        }
    }

    public get freeSpaces() {
        return this._freeSpaces();
    }

    public insert(...items: Item[]) {
        let results = items.map(() => ({ success: false }));
        let itemsResult = items.map((item, i) => ({ item: item, result: results[i] }));
        itemsResult.sort((a, b) => b.item.length - a.item.length);
        for (let itemResult of itemsResult) {
            let item = itemResult.item;
            for (let freeSpace of this.freeSpaces) {
                if (freeSpace.length >= item.length) {
                    this.packed_.splice(freeSpace.index, 0, { start: freeSpace.start, item: item });
                    itemResult.result.success = true;
                    break;
                }
            }
        }
        return results.map((result) => result.success);
    }
}
