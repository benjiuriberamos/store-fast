<?php

namespace App\Controller\Admin;

use App\Entity\Product;
use App\Form\Type\FileBrowserType;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class ProductCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Product::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            // IdField::new('id'),
            TextField::new('name', 'Nombre de producto'),
            TextEditorField::new('description', 'Descripción'),
            TextField::new('price', 'Precio por caja'),
            CollectionField::new('prices', 'Precios por otras cantidades')
                ->setEntryType(TextType::class) // Usa ImageField para gestionar imágenes
                ->renderExpanded()
                ->setEntryIsComplex()
                ->allowAdd()
                ->allowDelete()
                ->setFormTypeOption('by_reference', false),
            CollectionField::new('images', 'Imágenes')
                ->setEntryType(FileBrowserType::class) // Usa ImageField para gestionar imágenes
                ->renderExpanded()
                ->setEntryIsComplex()
                ->allowAdd()
                ->allowDelete()
                ->setFormTypeOption('by_reference', false),
        ];
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->renderContentMaximized()
            ->renderSidebarMinimized(false)
            ->setEntityLabelInSingular('Producto')
            ->setEntityLabelInPlural('Productos')
            ->overrideTemplate('layout', 'admin/dashboard.html.twig')
            ->setFormThemes(['admin/form.html.twig', '@EasyAdmin/crud/form_theme.html.twig'])
        ;
    }

    public function configureActions(Actions $actions): Actions
    {
        $viewInvoice = Action::new('View Invoice', 'Exportar a pdf','fas fa-file-invoice')
            ->linkToRoute('pdf_build')
            ->createAsGlobalAction()
            ;

        return $actions
            // ...
            ->add(Crud::PAGE_INDEX, $viewInvoice);
    }
}
