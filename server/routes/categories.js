import express from 'express';
import { db } from '../services/firebase.js';

const router = express.Router();

// Get all categories with their subcategories
router.get('/', async (req, res) => {
  try {
    const categoriesRef = db.collection('categories');
    const snapshot = await categoriesRef.get();
    const categories = [];

    for (const doc of snapshot.docs) {
      const categoryData = { id: doc.id, ...doc.data() };
      const subcategoriesRef = doc.ref.collection('subcategories');
      const subcategoriesSnapshot = await subcategoriesRef.get();
      categoryData.subcategories = subcategoriesSnapshot.docs.map(subDoc => ({ id: subDoc.id, ...subDoc.data() }));
      categories.push(categoryData);
    }

    res.status(200).json(categories);
  } catch (error) {
    console.error('Error getting categories with subcategories:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to retrieve categories', error: error.message });
    // Possible causes for 500 errors:
    // 1. Firestore security rules preventing read access.
    //    Check your Firestore console -> 'Rules' to ensure read permissions are granted.
  }
});

// Create a new category (or main category)
router.post('/', async (req, res) => {
  try {
    const { name, parentId } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const newCategory = {
      name,
      createdAt: new Date(),
    };

    let docRef;
    if (parentId) {
      // Create as a subcategory
      const parentCategoryRef = db.collection('categories').doc(parentId);
      docRef = await parentCategoryRef.collection('subcategories').add(newCategory);
    } else {
      // Create as a main category
      docRef = await db.collection('categories').add(newCategory);
    }

    res.status(201).json({ message: 'Category created successfully', categoryId: docRef.id });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Failed to create category', error: error.message });
  }
});

// Update a main category
router.put('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required for update' });
    }

    const categoryRef = db.collection('categories').doc(categoryId);
    await categoryRef.update({ name, updatedAt: new Date() });

    // Update all businesses that use this main category
    const businessesSnapshot = await db.collection('businesses').where('mainCategoryId', '==', categoryId).get();
    const batch = db.batch();
    businessesSnapshot.forEach(doc => {
      batch.update(doc.ref, { mainCategoryName: name });
    });
    await batch.commit();

    res.status(200).json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
});

// Update a subcategory
router.put('/:parentId/subcategories/:id', async (req, res) => {
  try {
    const { parentId, id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Subcategory name is required for update' });
    }

    const subcategoryRef = db.collection('categories').doc(parentId).collection('subcategories').doc(id);
    await subcategoryRef.update({ name, updatedAt: new Date() });

    // Update all businesses that use this subcategory
    const businessesSnapshot = await db.collection('businesses').where('subCategoryId', '==', id).get();
    const batch = db.batch();
    businessesSnapshot.forEach(doc => {
      batch.update(doc.ref, { subCategoryName: name });
    });
    await batch.commit();

    res.status(200).json({ message: 'Subcategory updated successfully' });
  } catch (error) {
    console.error('Error updating subcategory:', error);
    res.status(500).json({ message: 'Failed to update subcategory', error: error.message });
  }
});

// Delete a main category and its subcategories
router.delete('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const categoryRef = db.collection('categories').doc(categoryId);

    // Delete all subcategories first
    const subcategoriesSnapshot = await categoryRef.collection('subcategories').get();
    const deleteSubcategoryPromises = [];
    subcategoriesSnapshot.forEach(doc => {
      deleteSubcategoryPromises.push(doc.ref.delete());
    });
    await Promise.all(deleteSubcategoryPromises);

    // Then delete the main category
    await categoryRef.delete();

    res.status(200).json({ message: 'Category and its subcategories deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
});

// Delete a subcategory
router.delete('/:parentId/subcategories/:id', async (req, res) => {
  try {
    const { parentId, id } = req.params;
    const subcategoryRef = db.collection('categories').doc(parentId).collection('subcategories').doc(id);
    await subcategoryRef.delete();

    res.status(200).json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({ message: 'Failed to delete subcategory', error: error.message });
  }
});

export default router;