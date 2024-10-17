<?php

namespace App\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class FileExtensionExtension extends AbstractExtension
{
    public function getFilters(): array
    {
        return [
            new TwigFilter('extension', [$this, 'extension'])
        ];
    }

    public function extension(string $file): string
    {
        return strtolower(pathinfo($file, PATHINFO_EXTENSION));
    }
}
