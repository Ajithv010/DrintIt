package com.ajith.drinkit.service;

import java.util.List;

import com.ajith.drinkit.entity.Category;

public interface CategoryService {

    Category createCategory(Category category);

    List<Category> getAllCategories();

    Category getCategoryById(Long id);

    Category updateCategory(Long id, Category category);

    void deleteCategory(Long id);
}