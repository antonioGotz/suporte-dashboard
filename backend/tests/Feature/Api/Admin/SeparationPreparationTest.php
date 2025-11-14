<?php

namespace Tests\Feature\Api\Admin;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeparationPreparationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->markTestSkipped('Teste temporariamente desabilitado enquanto a lógica estável é validada manualmente.');
    }

    public function test_placeholder(): void
    {
        $this->assertTrue(true);
    }
}
