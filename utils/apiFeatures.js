/**
 * API Features
 * -> Sorting
 * -> Filtering
 * -> Field Limiting
 * -> Pagination
 */

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // filtering
  filter() {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];

    // Delete excluded fields from queryObj
    excludedFields.forEach((field) => delete queryObj[field]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Create a query object to filter tours based on specified criteria
    this.query = this.query.find(JSON.parse(queryStr));

    // return the current object instance
    return this;
  }

  // sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }
    // return the current object instance
    return this;
  }

  // field limiting
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    // return the current object instance
    return this;
  }

  // pagination
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    // if (this.queryString.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (numTours <= skip) throw new Error('This page does not exist');
    // }

    // return the current object instance
    return this;
  }
}

module.exports = APIFeatures;
